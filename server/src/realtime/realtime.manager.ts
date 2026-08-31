import { WebSocket } from "ws";

const spaceConnections = new Map<string, Set<WebSocket>>();

export function addConnection(spaceId: string, socket: WebSocket) {
    let connections = spaceConnections.get(spaceId);

    if (!connections) {
        connections = new Set<WebSocket>();
        spaceConnections.set(spaceId, connections);
    }

    connections.add(socket);
}

export function removeConnection(spaceId: string, socket: WebSocket) {
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
