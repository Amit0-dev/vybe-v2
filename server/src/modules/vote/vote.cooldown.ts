import { redis } from "../../infra/redis.js";

const VOTE_COOLDOWN_SECONDS = 1;

function getVoteCooldownKey(userId: string, queueItemId: string) {
    return `vote:cooldown:${userId}:${queueItemId}`;
}

export async function acquireVoteCooldown(userId: string, queueItemId: string) {
    const result = await redis.set(getVoteCooldownKey(userId, queueItemId), "1", {
        condition: "NX",
        expiration: {
            type: "EX",
            value: VOTE_COOLDOWN_SECONDS,
        },
    });

    return result === "OK";
}
