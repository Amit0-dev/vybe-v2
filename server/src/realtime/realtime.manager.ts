import { WebSocket } from "ws";
import { RealtimeSocket } from "./realtime.server.js";

const spaceConnections = new Map<string, Set<RealtimeSocket>>();

export function addConnection(spaceId: string, socket: RealtimeSocket) {
    let connections = spaceConnections.get(spaceId);

    if (!connections) {
        connections = new Set<RealtimeSocket>();
        spaceConnections.set(spaceId, connections);
    }

    connections.add(socket);
}

export function removeConnection(spaceId: string, socket: RealtimeSocket) {
    const connections = spaceConnections.get(spaceId);

    if (!connections) {
        return;
    }

    connections.delete(socket);

    if (connections.size === 0) {
        spaceConnections.delete(spaceId);
    }
}

export function getSpaceConnections(spaceId: string) {
    return spaceConnections.get(spaceId);
}

export function broadcastToSpace(spaceId: string, event: unknown) {
    const connections = spaceConnections.get(spaceId);

    if (!connections) {
        return;
    }

    const message = JSON.stringify(event);

    for (const socket of connections) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    }
}

export function isUserConnectedToSpace(spaceId: string, userId: string) {
    const connections = spaceConnections.get(spaceId);

    if (!connections) {
        return false;
    }

    for (const socket of connections) {
        if (socket.userId === userId) {
            return true;
        }
    }

    return false;
}

export function getActiveUsersCountInSpace(spaceId: string) {
    const connections = spaceConnections.get(spaceId);

    if (!connections) {
        return 0;
    }

    const uniqueUserIds = new Set<string>();

    for (const socket of connections) {
        uniqueUserIds.add(socket.userId);
    }

    return uniqueUserIds.size;
}