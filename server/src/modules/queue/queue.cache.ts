import { redis } from "../../infra/redis.js";

function getQueueScoreKey(queueItemId: string) {
    return `queue:score:${queueItemId}`;
}

export async function initializeQueueItemScore(queueItemId: string, score: number) {
    const key = getQueueScoreKey(queueItemId);
    return redis.set(key, score.toString(), {
        condition: "NX",
    });
}

export async function incrementQueueItemScore(queueItemId: string, delta: number) {
    const key = getQueueScoreKey(queueItemId);

    return redis.incrBy(key, delta);
}

export async function getQueueItemScore(queueItemId: string) {
    const key = getQueueScoreKey(queueItemId);
    return redis.get(key);
}

export async function setQueueItemScore(queueItemId: string, score: number) {
    const key = getQueueScoreKey(queueItemId);

    await redis.set(key, score.toString());

    return score;
}
