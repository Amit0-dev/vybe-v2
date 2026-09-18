"use client";

import { useCallback, useEffect, useState } from "react";
import type {
    QueueItem,
    ServerMessage,
    SpaceConnectionStatus,
    SpaceSnapshot,
} from "../realtime/space-ws.types";
import { createSpaceWsClient } from "../realtime/space-ws.client";

function sortQueue(queue: QueueItem[]): QueueItem[] {
    return [...queue].sort((a, b) => b.score - a.score);
}

export function useSpaceRealtime(spaceId: string) {
    const [status, setStatus] = useState<SpaceConnectionStatus>("connecting");

    const [snapshot, setSnapshot] = useState<SpaceSnapshot | null>(null);

    const [error, setError] = useState<string | null>(null);

    const handleMessage = useCallback(
        (event: MessageEvent) => {
            let message: ServerMessage;

            try {
                message = JSON.parse(event.data);
            } catch {
                setError("Received an invalid server message");
                return;
            }

            if (message.spaceId !== spaceId) {
                return;
            }

            switch (message.type) {
                case "SPACE_SNAPSHOT": {
                    setSnapshot(message.payload);
                    setError(null);
                    break;
                }

                case "QUEUE_ITEM_ADDED": {
                    setSnapshot((current) => {
                        if (!current) return current;

                        const exists = current.queue.some(
                            (item) => item.id === message.queueItem.id,
                        );

                        if (exists) return current;

                        return {
                            ...current,
                            queue: [...current.queue, message.queueItem],
                        };
                    });
                    break;
                }

                case "QUEUE_ITEM_VOTE_UPDATED": {
                    setSnapshot((current) => {
                        if (!current) return current;

                        const queue = current.queue.map((item) =>
                            item.id === message.queueItemId
                                ? { ...item, score: message.score }
                                : item,
                        );

                        return {
                            ...current,
                            queue: sortQueue(queue),
                        };
                    });
                    break;
                }

                case "QUEUE_ITEM_SKIPPED": {
                    setSnapshot((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            queue: current.queue.filter((item) => item.id !== message.queueItemId),
                        };
                    });
                    break;
                }

                case "QUEUE_ITEM_PLAYING": {
                }
            }
        },
        [spaceId],
    );

    useEffect(() => {
        if (!spaceId) return;

        setStatus("connecting");

        const client = createSpaceWsClient({
            spaceId,
            onOpen() {
                setStatus("connected");
                setError(null);
            },
            onClose() {
                setStatus("disconnected");
            },

            onReconnect() {
                setStatus("reconnecting");
            },

            onError() {
                setStatus("error");
                setError("WebSocket connection error");
            },
            onMessage(event) {
                handleMessage(event);
            },
        });

        return () => {
            client.close();
        };
    }, [spaceId, handleMessage]);

    return { status, snapshot, error };
}
