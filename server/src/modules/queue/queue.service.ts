import { QueueItemStatus } from "../../generated/prisma/enums.js";
import { logger } from "../../infra/logger.js";
import { ConflictError, NotFoundError } from "../../lib/errors.js";
import { findTrackById } from "../track/track.repository.js";
import { addQueueItem, getQueueRanking, removeQueueItem } from "./queue.ranking.js";
import {
    createQueueItem,
    findActiveQueueItem,
    findQueueItemById,
    findQueueItemInSpace,
    findQueueItemsByIds,
    transitionQueueItemStatus,
} from "./queue.repository.js";

export async function addTrackToQueue(spaceId: string, trackId: string) {
    const track = await findTrackById(trackId);

    if (!track) {
        throw new NotFoundError("Track not found", "TRACK_NOT_FOUND");
    }

    const existingQueueItem = await findActiveQueueItem(spaceId, trackId);

    if (existingQueueItem) {
        return existingQueueItem;
    }

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
    }

    return queueItem;
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

export async function transitionQueueItem(queueItemId: string, nextStatus: QueueItemStatus) {
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
        }
    }

    return updatedQueueItem;
}

export async function skipQueueItem(spaceId: string, queueItemId: string) {
    const queueItem = await findQueueItemInSpace(queueItemId, spaceId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    if (
        queueItem.status !== QueueItemStatus.QUEUED &&
        queueItem.status !== QueueItemStatus.PLAYING
    ) {
        throw new ConflictError("Queue item cannot be skipped", "QUEUE_ITEM_CANNOT_BE_SKIPPED");
    }

    const result = await transitionQueueItemStatus(
        queueItem.id,
        queueItem.status,
        QueueItemStatus.SKIPPED,
    );

    if (result.count === 0) {
        throw new ConflictError(
            "Queue item state changed by another request",
            "QUEUE_ITEM_STATE_CHANGED",
        );
    }

    const updatedQueueItem = await findQueueItemById(queueItem.id);

    if (!updatedQueueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    try {
        await removeQueueItem(spaceId, queueItem.id);
    } catch (error) {
        logger.error(
            {
                error,
                queueItemId: queueItem.id,
                spaceId,
            },
            "Failed to remove skipped QueueItem from Redis ranking",
        );
    }

    return updatedQueueItem;
}
