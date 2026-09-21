import { Prisma, QueueItemStatus, SpaceStatus } from "../../generated/prisma/client.js";
import { generatePlaybackUrl } from "../../integrations/storage/cloudfront.client.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { RealtimeEvent } from "../../realtime/realtime.events.js";
import { broadcastToSpace } from "../../realtime/realtime.manager.js";
import { getPlaybackCandidates } from "../queue/queue.ranking.js";
import {
    claimQueueItem,
    findPlayingQueueItem,
    findQueueItemById,
    findQueueItemForAudio,
    findQueueItemForPlayback,
    findQueueItemInSpace,
} from "../queue/queue.repository.js";
import { skipQueueItem, transitionQueueItem } from "../queue/queue.service.js";
import { findSpaceById } from "../space/space.repository.js";
import { clearOwnerOffline, markOwnerOffline } from "./playback.presence.js";

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

    broadcastToSpace(spaceId, {
        type: RealtimeEvent.QUEUE_ITEM_COMPLETED,
        spaceId,
        queueItemId: queueItem.id,
    });

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

export async function getPlaybackState(spaceId: string) {
    return findPlayingQueueItem(spaceId);
}

export async function handleUserDisconnected(spaceId: string, userId: string) {
    const space = await findSpaceById(spaceId);

    if (!space) {
        return;
    }

    if (space.ownerId !== userId) {
        return;
    }

    if (space.status !== SpaceStatus.ACTIVE) {
        return;
    }

    await markOwnerOffline(spaceId);
}

export async function handleUserConnected(spaceId: string, userId: string) {
    const space = await findSpaceById(spaceId);

    if (!space) {
        return;
    }

    if (space.ownerId !== userId) {
        return;
    }

    await clearOwnerOffline(spaceId);
}

export async function shutdownPlayback(spaceId: string) {
    const playingQueueItem = await findPlayingQueueItem(spaceId);

    if (!playingQueueItem) {
        return null;
    }

    const skippedQueueItem = await skipQueueItem(spaceId, playingQueueItem.id);

    return skippedQueueItem;
}

export async function getPlaybackUrl(spaceId: string, queueItemId: string) {
    const queueItem = await findQueueItemForAudio(queueItemId, spaceId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    if (queueItem.status !== QueueItemStatus.PLAYING) {
        throw new BadRequestError("Queue item is not currently playing", "QUEUE_ITEM_NOT_PLAYING");
    }

    if (queueItem.track.source !== "CUSTOM") {
        throw new BadRequestError(
            "Playback URL is only available for custom tracks",
            "TRACK_NOT_CUSTOM",
        );
    }

    if (!queueItem.track.storageKey) {
        throw new Error("Custom track has no storage key");
    }

    const url = generatePlaybackUrl(queueItem.track.storageKey);

    return {
        url,
    };
}
