import { Prisma, QueueItemStatus } from "../../generated/prisma/client.js";
import { NotFoundError } from "../../lib/errors.js";
import { RealtimeEvent } from "../../realtime/realtime.events.js";
import { broadcastToSpace } from "../../realtime/realtime.manager.js";
import { getPlaybackCandidates } from "../queue/queue.ranking.js";
import {
    claimQueueItem,
    findPlayingQueueItem,
    findQueueItemById,
    findQueueItemForPlayback,
    findQueueItemInSpace,
} from "../queue/queue.repository.js";
import { skipQueueItem, transitionQueueItem } from "../queue/queue.service.js";

export async function startNextTrack(spaceId: string) {
    // If something is already playing, return it
    const playingQueueItem = await findPlayingQueueItem(spaceId);

    if (playingQueueItem) {
        return playingQueueItem;
    }

    // Get candidate from Redis - highest scores first
    const candidates = await getPlaybackCandidates(spaceId);

    // Try to claim candidates one by one
    for (const candidate of candidates) {
        try {
            const result = await claimQueueItem(candidate.value, spaceId);

            // candidate was stale or already claimed
            if (result.count === 0) {
                continue;
            }

            // on success
            const queueItem = await findQueueItemForPlayback(candidate.value);

            if (!queueItem) {
                throw new Error("Queue item disappeared after being claimed");
            }

            broadcastToSpace(spaceId, {
                type: RealtimeEvent.QUEUE_ITEM_PLAYING,
                spaceId,
                queueItemId: queueItem.id,
            });

            return queueItem;
        } catch (error) {
            // if "one PLAYING per space" constraint fire

            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                const playingQueueItem = await findPlayingQueueItem(spaceId);

                if (playingQueueItem) {
                    return playingQueueItem;
                }
            }

            throw error;
        }
    }

    // Nothing was available to play.
    return null;
}

export async function startPlayback(spaceId: string) {
    return startNextTrack(spaceId);
}

export async function completePlayback(spaceId: string, queueItemId: string) {
    const queueItem = await findQueueItemInSpace(queueItemId, spaceId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    const updatedQueueItem = await transitionQueueItem(queueItem.id, QueueItemStatus.PLAYED);

    const nextQueueItem = await startNextTrack(spaceId);

    return {
        completedQueueItem: updatedQueueItem,
        nextQueueItem,
    };
}

export async function skipPlayback(spaceId: string, queueItemId: string) {
    const queueItem = await findQueueItemInSpace(queueItemId, spaceId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    const wasPlaying = queueItem.status === QueueItemStatus.PLAYING;

    const skippedQueueItem = await skipQueueItem(spaceId, queueItemId);

    if (!wasPlaying) {
        return {
            skippedQueueItem,
            nextQueueItem: null,
        };
    }

    const nextQueueItem = await startNextTrack(spaceId);

    return {
        skippedQueueItem,
        nextQueueItem,
    };
}
