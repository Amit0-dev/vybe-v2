"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiQueueItem } from "@/features/queue/types/queue.types";
import type {
    ServerMessage,
    SpaceClosedReason,
    SpaceConnectionStatus,
    SpaceSnapshot,
} from "../types/ws.types";
import { createSpaceWsClient } from "../realtime/space-ws.client";

function sortQueue(queue: ApiQueueItem[]): ApiQueueItem[] {
    return [...queue].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

function upsertQueueItem(queue: ApiQueueItem[], incoming: ApiQueueItem): ApiQueueItem[] {
    const exists = queue.some((item) => item.id === incoming.id);

    const updatedQueue = exists
        ? queue.map((item) => (item.id === incoming.id ? incoming : item))
        : [...queue, incoming];

    return sortQueue(updatedQueue);
}

export function useSpaceRealtime(spaceId: string) {
    const [status, setStatus] = useState<SpaceConnectionStatus>("connecting");

    const [snapshot, setSnapshot] = useState<SpaceSnapshot | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isOwnerOnline, setIsOwnerOnline] = useState(true);
    const [isSpaceClosed, setIsSpaceClosed] = useState(false);
    const [spaceClosedReason, setSpaceClosedReason] = useState<SpaceClosedReason | null>(null);

    const applyQueueItem = useCallback((queueItem: ApiQueueItem) => {
        setSnapshot((current) => {
            if (!current) return current;

            return {
                ...current,
                queue: upsertQueueItem(current.queue, queueItem),
            };
        });
    }, []);

    const applyQueueScore = useCallback((queueItemId: string, score: number) => {
        setSnapshot((current) => {
            if (!current) return current;

            return {
                ...current,
                queue: sortQueue(
                    current.queue.map((item) =>
                        item.id === queueItemId ? { ...item, score } : item,
                    ),
                ),
            };
        });
    }, []);

    const applyPlayback = useCallback((playback: ApiQueueItem | null) => {
        setSnapshot((current) => {
            if (!current) return current;

            return {
                ...current,
                playback,
            };
        });
    }, []);

    const handleMessage = useCallback(
        (event: MessageEvent, client: ReturnType<typeof createSpaceWsClient>) => {
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
                    setIsOwnerOnline(message.payload.ownerOnline);
                    setError(null);
                    break;
                }

                case "SPACE_MEMBER_JOINED": {
                    setSnapshot((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            memberCount: current.memberCount + 1,
                        };
                    });
                    break;
                }

                case "LIVE_USER_COUNT_UPDATED": {
                    setSnapshot((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            liveUserCount: message.liveUserCount,
                        };
                    });
                    break;
                }

                case "QUEUE_ITEM_ADDED": {
                    const queueItem = message.queueItem;

                    setSnapshot((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            queue: upsertQueueItem(current.queue, queueItem),
                        };
                    });

                    break;
                }

                case "QUEUE_ITEM_VOTE_UPDATED": {
                    const { queueItemId, score } = message;

                    setSnapshot((current) => {
                        if (!current) return current;

                        const updatedQueue = current.queue.map((item) =>
                            item.id === queueItemId
                                ? {
                                      ...item,
                                      score: score,
                                  }
                                : item,
                        );

                        return {
                            ...current,
                            queue: sortQueue(updatedQueue),
                        };
                    });

                    break;
                }

                case "QUEUE_ITEM_SKIPPED": {
                    const { queueItemId } = message;

                    setSnapshot((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            playback:
                                current.playback?.id === queueItemId ? null : current.playback,
                            queue: current.queue.filter((item) => item.id !== queueItemId),
                        };
                    });

                    break;
                }

                case "QUEUE_ITEM_COMPLETED": {
                    const { queueItemId } = message;

                    setSnapshot((current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            playback:
                                current.playback?.id === queueItemId ? null : current.playback,
                            queue: current.queue.filter((item) => item.id !== queueItemId),
                        };
                    });

                    break;
                }

                case "QUEUE_ITEM_PLAYING": {
                    const { queueItemId } = message;

                    setSnapshot((current) => {
                        if (!current) return current;

                        const playingItem = current.queue.find((item) => item.id === queueItemId);

                        return {
                            ...current,
                            playback: playingItem
                                ? { ...playingItem, status: "PLAYING" }
                                : current.playback,
                            queue: current.queue.map((item) =>
                                item.id === queueItemId
                                    ? {
                                          ...item,
                                          status: "PLAYING",
                                      }
                                    : item,
                            ),
                        };
                    });

                    break;
                }

                case "OWNER_OFFLINE": {
                    setIsOwnerOnline(false);
                    break;
                }

                case "OWNER_ONLINE": {
                    setIsOwnerOnline(true);
                    break;
                }

                case "SPACE_CLOSED": {
                    client.markConnectionTerminal();
                    setIsOwnerOnline(false);
                    setIsSpaceClosed(true);
                    setSpaceClosedReason(message.reason);
                    break;
                }
            }
        },
        [spaceId],
    );

    useEffect(() => {
        if (!spaceId) return;

        let cancelled = false;

        queueMicrotask(() => {
            if (!cancelled) setStatus("connecting");
        });

        let client: ReturnType<typeof createSpaceWsClient>;

        client = createSpaceWsClient({
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
                handleMessage(event, client);
            },
        });

        return () => {
            cancelled = true;
            client.close();
        };
    }, [spaceId, handleMessage]);

    return {
        status,
        snapshot,
        error,
        isOwnerOnline,
        isSpaceClosed,
        spaceClosedReason,
        applyQueueItem,
        applyQueueScore,
        applyPlayback,
    };
}
