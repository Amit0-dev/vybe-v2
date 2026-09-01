import { redis } from "../../infra/redis.js";
import { findQueueItemsForRanking } from "./queue.repository.js";

function getRankingKey(spaceId: string) {
    return `queue:ranking:${spaceId}`;
}

export async function rebuildSpaceRanking(spaceId: string) {
    const queueItems = await findQueueItemsForRanking(spaceId);

    const key = getRankingKey(spaceId);

    const entries = queueItems.map((item) => ({
        score: item.score,
        value: item.id,
    }));

    await redis.multi().del(key).zAdd(key, entries).exec();
}

// used when new queueItem -> initialize redis ranking
export async function addQueueItem(spaceId: string, queueItemId: string, score: number) {
    return redis.zAdd(getRankingKey(spaceId), {
        score,
        value: queueItemId,
    });
}

// used when reconciliation -> redis should have exactly score X.
export async function setQueueItemScore(spaceId: string, queueItemId: string, score: number) {
    return redis.zAdd(getRankingKey(spaceId), {
        score,
        value: queueItemId,
    });
}

export async function incrementQueueItemScore(spaceId: string, queueItemId: string, delta: number) {
    return redis.zIncrBy(getRankingKey(spaceId), delta, queueItemId);
}

export async function getQueueItemRank(spaceId: string, queueItemId: string) {
    const rank = await redis.zRevRank(getRankingKey(spaceId), queueItemId);

    if (rank === null) {
        return null;
    }

    return rank + 1;
}

export async function removeQueueItem(spaceId: string, queueItemId: string) {
    return redis.zRem(getRankingKey(spaceId), queueItemId);
}
