import { WebSocketServer, WebSocket } from "ws";
import { Server } from "node:http";
import { logger } from "../infra/logger.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { findUserById } from "../modules/auth/auth.repository.js";
import { findMembership } from "../modules/space/space.repository.js";
import { addConnection, removeConnection } from "./realtime.manager.js";

interface RealtimeSocket extends WebSocket {
    userId: string;
    spaceId: string;
}

let wss: WebSocketServer;

export function initializeRealtime(server: Server) {
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

            logger.info({ userId: user.id, spaceId }, "WebSocket client connected");

            socket.on("close", () => {
                removeConnection(spaceId, realtimeSocket);

                logger.info({ userId: user.id, spaceId }, "WebSocket client disconnected");
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
