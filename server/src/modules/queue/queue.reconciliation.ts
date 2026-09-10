import { getQueueRanking, repairQueueRanking } from "./queue.ranking.js";
import {
    batchUpdateQueueItemScores,
    findQueueItemsForRanking,
    findQueueItemVoteTotals,
} from "./queue.repository.js";

export type Repair = {
    queueItemId: string;
    score: number;
};

export async function reconcileSpaceQueue(spaceId: string) {
    const expectedScores = await reconcilePostgresProjection(spaceId);

    await reconcileRedisProjection(spaceId, expectedScores);
}

async function reconcilePostgresProjection(spaceId: string) {
    const [queueItems, voteTotals] = await Promise.all([
        findQueueItemsForRanking(spaceId),
        findQueueItemVoteTotals(spaceId),
    ]);

    const voteScoreMap = new Map(
        voteTotals.map((item) => [item.queueItemId, item._sum.value ?? 0]),
    );

    const repairs: Repair[] = [];
    const expectedScores = new Map<string, number>();

    for (const queueItem of queueItems) {
        const authoritativeScore = voteScoreMap.get(queueItem.id) ?? 0;

        expectedScores.set(queueItem.id, authoritativeScore);

        if (queueItem.score !== authoritativeScore) {
            repairs.push({
                queueItemId: queueItem.id,
                score: authoritativeScore,
            });
        }
    }

    console.log("POSTGRES REPAIRS : ", repairs)
    if (repairs.length > 0) {
        await batchUpdateQueueItemScores(repairs);
    }

    return expectedScores;
}

async function reconcileRedisProjection(spaceId: string, expectedScores: Map<string, number>) {
    const redisRanking = await getQueueRanking(spaceId);

    const actualScores = new Map(redisRanking.map((item) => [item.value, item.score]));

    const scoreUpdates: {
        queueItemId: string;
        score: number;
    }[] = [];
    const removals: string[] = [];

    for (const [queueItemId, expectedScore] of expectedScores) {
        const actualScore = actualScores.get(queueItemId);

        if (actualScore === undefined || actualScore !== expectedScore) {
            scoreUpdates.push({
                queueItemId,
                score: expectedScore,
            });
        }
    }

    for (const queueItemId of actualScores.keys()) {
        if (!expectedScores.has(queueItemId)) {
            removals.push(queueItemId);
        }
    }

    console.log({
        removals,
        scoreUpdates,
        spaceId
    })
    await repairQueueRanking(spaceId, scoreUpdates, removals);
}
