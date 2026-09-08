import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../infra/db.js";
import { logger } from "../../infra/logger.js";
import { NotFoundError, TooManyRequestsError } from "../../lib/errors.js";
import { RealtimeEvent } from "../../realtime/realtime.events.js";
import { broadcastToSpace } from "../../realtime/realtime.manager.js";
import { incrementQueueItemScore } from "../queue/queue.ranking.js";
import { findQueueItemInSpace } from "../queue/queue.repository.js";
import { acquireVoteCooldown } from "./vote.cooldown.js";
import {
    createQueueItemVote,
    deleteQueueItemVote,
    findQueueItemVote,
    updateQueueItemVote,
} from "./vote.repository.js";

type VoteValue = -1 | 0 | 1;
type RequestedVote = -1 | 1;

function calculateVoteDelta(oldValue: VoteValue, newValue: VoteValue) {
    return newValue - oldValue;
}

async function runVoteTransaction(queueItemId: string, userId: string, value: RequestedVote) {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            return prisma.$transaction(async (tx) => {
                const existingVote = await findQueueItemVote(tx, queueItemId, userId);

                const oldValue: VoteValue = existingVote ? (existingVote.value as VoteValue) : 0;

                if (oldValue === value) {
                    return {
                        changed: false,
                        delta: 0,
                        vote: oldValue,
                    };
                }

                const delta = calculateVoteDelta(oldValue, value);

                if (!existingVote) {
                    await createQueueItemVote(tx, queueItemId, userId, value);
                } else {
                    await updateQueueItemVote(tx, existingVote.id, value);
                }

                return {
                    changed: true,
                    delta,
                    vote: value,
                };
            });
        } catch (error) {
            const isUniqueConflict =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

            if (!isUniqueConflict || attempt === 1) {
                throw error;
            }
        }
    }

    throw new Error("Vote operation failed");
}

export async function voteOnQueueItem(
    spaceId: string,
    queueItemId: string,
    userId: string,
    value: RequestedVote,
) {
    const cooldownAcquired = await acquireVoteCooldown(userId, queueItemId);

    if (!cooldownAcquired) {
        throw new TooManyRequestsError("Please wait before voting again", "VOTE_COOLDOWN");
    }

    const queueItem = await findQueueItemInSpace(queueItemId, spaceId);

    if (!queueItem) {
        throw new NotFoundError("Queue item not found", "QUEUE_ITEM_NOT_FOUND");
    }

    const result = await runVoteTransaction(queueItemId, userId, value);

    let score: number | null = queueItem.score;

    if (result.changed && result.delta !== 0) {
        try {
            score = await incrementQueueItemScore(spaceId, queueItemId, result.delta);

            broadcastToSpace(spaceId, {
                type: RealtimeEvent.QUEUE_ITEM_VOTE_UPDATED,
                spaceId,
                queueItemId,
                score,
            });
            
        } catch (error) {
            logger.error(
                {
                    error,
                    spaceId,
                    queueItemId,
                    delta: result.delta,
                },
                "Failed to update Redis queue ranking after vote",
            );
        }
    }

    return {
        ...result,
        score
    };
}

export async function removeVote(queueItemId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
        const existingVote = await findQueueItemVote(tx, queueItemId, userId);

        if (!existingVote) {
            return {
                changed: false,
                delta: 0,
                vote: 0,
            };
        }

        const delta = -existingVote.value;

        await deleteQueueItemVote(tx, existingVote.id);

        return {
            changed: true,
            delta,
            vote: 0,
        };
    });
}
