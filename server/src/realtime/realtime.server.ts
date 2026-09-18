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

export interface RealtimeSocket extends WebSocket {
    userId: string;
    spaceId: string;
}

let wss: WebSocketServer;
let isRealtimeShuttingDown = false;

export function initializeRealtime(server: Server) {
    isRealtimeShuttingDown = false;

    wss = new WebSocketServer({
        server,
    });

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

            // add to Space connections
            addConnection(spaceId, realtimeSocket);
            const snapshot = await getSpaceRealtimeSnapshot(spaceId);

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

            logger.info({ userId: user.id, spaceId }, "WebSocket client connected");

            socket.on("close", async () => {
                removeConnection(spaceId, realtimeSocket);

                const stillConnected = isUserConnectedToSpace(spaceId, user.id);

                logger.info(
                    { userId: user.id, spaceId, stillConnected },
                    "WebSocket client disconnected",
                );

                if (isRealtimeShuttingDown) {
                    return;
                }

                if (!stillConnected) {
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
