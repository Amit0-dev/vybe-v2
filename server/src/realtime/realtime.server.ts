import { WebSocketServer, WebSocket } from "ws";
import { Server } from "node:http";
import { logger } from "../infra/logger.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { findUserById } from "../modules/auth/auth.repository.js";
import { findMembership } from "../modules/space/space.repository.js";
import { addConnection, isUserConnectedToSpace, removeConnection } from "./realtime.manager.js";
import {
    handleUserConnected,
    handleUserDisconnected,
} from "../modules/playback/playback.service.js";
import { getSpaceRealtimeSnapshot } from "../modules/space/space-realtime.service.js";
import { RealtimeEvent } from "./realtime.events.js";
import { refreshConnection, registerConnection, unregisterConnection } from "./presence.service.js";
import { getLiveUsersCountInSpace } from "./presence.service.js";
import { publishRealtimeEvent } from "./publishRealtimeEvent.js";

export interface RealtimeSocket extends WebSocket {
    userId: string;
    spaceId: string;
    isAlive: boolean;
}

let wss: WebSocketServer;
let heartbeatInterval: NodeJS.Timeout | null = null;
let isRealtimeShuttingDown = false;

export function initializeRealtime(server: Server) {
    isRealtimeShuttingDown = false;

    wss = new WebSocketServer({
        server,
    });

    heartbeatInterval = setInterval(() => {
        for (const socket of wss.clients) {
            const realtimeSocket = socket as RealtimeSocket;

            if (realtimeSocket.isAlive === false) {
                socket.terminate();
                continue;
            }

            realtimeSocket.isAlive = false;
            socket.ping();
        }
    }, 30_000);

    wss.on("connection", async (socket, request) => {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(request.headers),
            });

            if (!session) {
                socket.close(1008, "Authentication required");
                return;
            }

            const user = await findUserById(session.user.id);

            if (!user) {
                socket.close(1008, "User not found");
                return;
            }

            const url = new URL(request.url ?? "", `http://${request.headers.host}`);

            const spaceId = url.searchParams.get("spaceId");

            if (!spaceId) {
                socket.close(1008, "Space ID required");
                return;
            }

            const membership = await findMembership(spaceId, user.id);

            if (!membership) {
                socket.close(1008, "Not a member of this Space");
                return;
            }

            const realtimeSocket = socket as RealtimeSocket;

            realtimeSocket.userId = user.id;
            realtimeSocket.spaceId = spaceId;
            realtimeSocket.isAlive = true;

            if (socket.readyState !== WebSocket.OPEN) {
                return;
            }

            const previousLiveUserCount = await getLiveUsersCountInSpace(spaceId);

            // add to Space connections
            addConnection(spaceId, realtimeSocket);

            let presenceConnectionId: string;

            try {
                presenceConnectionId = await registerConnection(spaceId, user.id);
            } catch (error) {
                removeConnection(spaceId, realtimeSocket);

                logger.error(
                    {
                        err: error,
                        userId: user.id,
                        spaceId,
                    },
                    "Failed to register realtime presence",
                );

                socket.close(1011, "Realtime service unavailable");
                return;
            }

            if (socket.readyState !== WebSocket.OPEN) {
                removeConnection(spaceId, realtimeSocket);
                await unregisterConnection(spaceId, presenceConnectionId, user.id);
                return;
            }

            socket.on("pong", async () => {
                realtimeSocket.isAlive = true;

                try {
                    await refreshConnection(spaceId, presenceConnectionId, user.id);
                } catch (error) {
                    logger.error(
                        {
                            err: error,
                            userId: user.id,
                            spaceId,
                        },
                        "Failed to refresh realtime presence",
                    );
                }
            });

            const snapshot = await getSpaceRealtimeSnapshot(spaceId, user.id);

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: RealtimeEvent.SPACE_SNAPSHOT,
                        spaceId,
                        payload: snapshot,
                    }),
                );
            }

            try {
                await handleUserConnected(spaceId, user.id);
            } catch (error) {
                logger.error(
                    {
                        err: error,
                        userId: user.id,
                        spaceId,
                    },
                    "Failed to handle user connection",
                );
            }

            const liveUserCount = await getLiveUsersCountInSpace(spaceId);

            if (liveUserCount !== previousLiveUserCount) {
                await publishRealtimeEvent({
                    type: RealtimeEvent.LIVE_USER_COUNT_UPDATED,
                    spaceId,
                    liveUserCount,
                });
            }

            logger.info({ userId: user.id, spaceId }, "WebSocket client connected");

            socket.on("close", async () => {
                removeConnection(spaceId, realtimeSocket);

                let becameOffline = false;

                try {
                    becameOffline = await unregisterConnection(
                        spaceId,
                        presenceConnectionId,
                        user.id,
                    );
                } catch (error) {
                    logger.error(
                        {
                            err: error,
                            userId: user.id,
                            spaceId,
                        },
                        "Failed to unregister realtime presence",
                    );
                }

                logger.info(
                    {
                        userId: user.id,
                        spaceId,
                        becameOffline,
                    },
                    "WebSocket client disconnected",
                );

                if (isRealtimeShuttingDown) {
                    return;
                }

                if (becameOffline) {
                    await publishRealtimeEvent({
                        type: RealtimeEvent.LIVE_USER_COUNT_UPDATED,
                        spaceId,
                        liveUserCount: await getLiveUsersCountInSpace(spaceId),
                    });
                }

                if (becameOffline) {
                    try {
                        await handleUserDisconnected(spaceId, user.id);
                    } catch (error) {
                        logger.error(
                            {
                                err: error,
                                userId: user.id,
                                spaceId,
                            },
                            "Failed to handle user disconnect",
                        );
                    }
                }
            });

            socket.on("error", (error) => {
                logger.error(error, "WebSocket client error");
            });
        } catch (error) {
            logger.error(error, "WebSocket authentication failed");

            socket.close(1011, "Internal server error");
        }
    });

    logger.info("WebSocket server initialized");
}

export async function closeRealtime() {
    isRealtimeShuttingDown = true;

    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }

    if (!wss) {
        return;
    }

    for (const socket of wss.clients) {
        socket.close(1001, "Server shutting down");
    }

    await new Promise<void>((resolve, reject) => {
        wss.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}
