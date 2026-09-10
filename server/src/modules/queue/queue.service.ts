import { Prisma } from "../../generated/prisma/client.js";
import { QueueItemStatus } from "../../generated/prisma/enums.js";
import { logger } from "../../infra/logger.js";
import { ConflictError, NotFoundError } from "../../lib/errors.js";
import { RealtimeEvent } from "../../realtime/realtime.events.js";
import { broadcastToSpace } from "../../realtime/realtime.manager.js";
import { findTrackById } from "../track/track.repository.js";
import { voteOnQueueItem } from "../vote/vote.service.js";
import { addQueueItem, getQueueRanking, removeQueueItem } from "./queue.ranking.js";
import {
    createQueueItem,
    findActiveQueueItem,
    findQueueItemById,
    findQueueItemInSpace,
    findQueueItemsByIds,
    markSpaceForReconciliation,
    transitionQueueItemStatus,
} from "./queue.repository.js";

export async function addTrackToQueue(spaceId: string, trackId: string, userId: string) {
    const track = await findTrackById(trackId);

    if (!track) {
        throw new NotFoundError("Track not found", "TRACK_NOT_FOUND");
    }

    const existingQueueItem = await findActiveQueueItem(spaceId, trackId);

    if (existingQueueItem) {
        await voteOnQueueItem(spaceId, existingQueueItem.id, userId, 1);

        return {
            queueItem: existingQueueItem,
            action: "VOTED_EXISTING" as const,
        };
    }

    try {
        const queueItem = await createQueueItem(trackId, spaceId);

        try {
            await addQueueItem(spaceId, queueItem.id, queueItem.score);
        } catch (error) {
            logger.error(
                {
                    error,
                    queueItemId: queueItem.id,
                    spaceId,
                },
                "Failed to initialize QueueItem in Redis ranking",
            );

            try {
                await markSpaceForReconciliation(spaceId);
            } catch (reconciliationError) {
                logger.error(
                    {
                        error: reconciliationError,
                        spaceId,
                    },
                    "Failed to mark Space for queue reconciliation",
                );
            }
        }

        broadcastToSpace(spaceId, {
            type: RealtimeEvent.QUEUE_ITEM_ADDED,
            spaceId,
            queueItem: {
                id: queueItem.id,
                trackId: queueItem.trackId,
                score: queueItem.score,
                status: queueItem.status,
            },
        });

        return {
            queueItem,
            action: "CREATED" as const,
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            const existingQueueItem = await findActiveQueueItem(spaceId, trackId);

            if (existingQueueItem) {
                await voteOnQueueItem(spaceId, existingQueueItem.id, userId, 1);

                return {
                    queueItem: existingQueueItem,
                    action: "VOTED_EXISTING" as const,
                };
            }
        }

        throw error;
    }
}

export async function getQueue(spaceId: string) {
    const ranking = await getQueueRanking(spaceId);

    if (ranking.length === 0) {
        return [];
    }

    const queueItemIds = ranking.map((item) => item.value);

    const queueItems = await findQueueItemsByIds(queueItemIds);

    const queueItemMap = new Map(queueItems.map((item) => [item.id, item]));

    return ranking
        .map((rankingItem) => {
            const queueItem = queueItemMap.get(rankingItem.value);

            if (!queueItem) {
                return null;
            }

            return {
                ...queueItem,
                score: rankingItem.score,
            };
        })
        .filter((item) => item !== null);
}

function canTransition(currentStatus: QueueItemStatus, nextStatus: QueueItemStatus) {
    if (currentStatus === QueueItemStatus.QUEUED) {
        return nextStatus === QueueItemStatus.PLAYING || nextStatus === QueueItemStatus.SKIPPED;
    }

    if (currentStatus === QueueItemStatus.PLAYING) {
        return nextStatus === QueueItemStatus.PLAYED || nextStatus === QueueItemStatus.SKIPPED;
    }

    return false;
}

export async function transitionQueueItem(
    queueItemId: string,
    nextStatus: QueueItemStatus,
    spaceId: string,
) {
    const queueItem = await findQueueItemById(queueItemId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    if (!canTransition(queueItem.status, nextStatus)) {
        throw new ConflictError(
            `Cannot transition queue item from ${queueItem.status} to ${nextStatus}`,
            "INVALID_QUEUE_ITEM_TRANSITION",
        );
    }

    const result = await transitionQueueItemStatus(queueItemId, queueItem.status, nextStatus);

    if (result.count === 0) {
        throw new ConflictError(
            "Queue item was changed by another request",
            "QUEUE_ITEM_STATE_CHANGED",
        );
    }

    const updatedQueueItem = await findQueueItemById(queueItemId);

    if (nextStatus === QueueItemStatus.PLAYED || nextStatus === QueueItemStatus.SKIPPED) {
        try {
            await removeQueueItem(queueItem.spaceId, queueItem.id);
        } catch (error) {
            logger.error(
                {
                    error,
                    queueItemId: queueItem.id,
                    spaceId: queueItem.spaceId,
                },
                "Failed to remove inactive QueueItem from Redis ranking",
            );

            try {
                await markSpaceForReconciliation(queueItem.spaceId);
            } catch (reconciliationError) {
                logger.error(
                    {
                        error: reconciliationError,
                        spaceId: queueItem.spaceId,
                    },
                    "Failed to mark Space for queue reconciliation",
                );
            }
        }
    }

    return updatedQueueItem;
}

export async function skipQueueItem(spaceId: string, queueItemId: string) {
    const queueItem = await findQueueItemInSpace(queueItemId, spaceId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    const updatedQueueItem = await transitionQueueItem(
        queueItem.id,
        QueueItemStatus.SKIPPED,
        spaceId,
    );

    broadcastToSpace(spaceId, {
        type: RealtimeEvent.QUEUE_ITEM_SKIPPED,
        spaceId,
        queueItemId,
    });

    return updatedQueueItem;
}
