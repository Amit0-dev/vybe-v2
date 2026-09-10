import { redis } from "../../infra/redis.js";
import { Repair } from "./queue.reconciliation.js";
import { findQueueItemsForRanking } from "./queue.repository.js";

type RankingScoreUpdate = {
    queueItemId: string;
    score: number;
};

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

export async function getQueueRanking(spaceId: string) {
    return redis.zRangeWithScores(getRankingKey(spaceId), 0, -1);
}

export async function repairQueueRanking(
    spaceId: string,
    scoreUpdates: RankingScoreUpdate[],
    removals: string[],
) {
    if (scoreUpdates.length === 0 && removals.length === 0) {
        return;
    }

    const multi = redis.multi();

    for (const update of scoreUpdates) {
        multi.zAdd(getRankingKey(spaceId), {
            score: update.score,
            value: update.queueItemId,
        });
    }

    for (const queueItemId of removals) {
        multi.zRem(getRankingKey(spaceId), queueItemId);
    }

    await multi.exec();
}

export async function getPlaybackCandidates(spaceId: string) {
    return redis.zRangeWithScores(getRankingKey(spaceId), 0, -1, { REV: true });
}
