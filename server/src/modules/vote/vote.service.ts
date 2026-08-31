import prisma from "../../infra/db.js";
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

export async function voteOnQueueItem(queueItemId: string, userId: string, value: RequestedVote) {
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
