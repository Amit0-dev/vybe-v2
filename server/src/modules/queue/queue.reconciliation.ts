import { logger } from "../../infra/logger.js";
import { addQueueItem } from "./queue.ranking.js";
import {
    batchUpdateQueueItemScores,
    findQueueItemsForRanking,
    findQueueItemVoteTotals,
    updateQueueItemScore,
} from "./queue.repository.js";

type Repair = {
    queueItemId: string;
    score: number;
};

export async function reconcileSpaceQueue(spaceId: string) {
    const [queueItems, voteTotals] = await Promise.all([
        findQueueItemsForRanking(spaceId),
        findQueueItemVoteTotals(spaceId),
    ]);

    const voteScoreMap = new Map(
        voteTotals.map((item) => [item.queueItemId, item._sum.value ?? 0]),
    );

    const repairs: Repair[] = [];

    for (const queueItem of queueItems) {
        const authoritativeScore = voteScoreMap.get(queueItem.id) ?? 0;

        if (queueItem.score !== authoritativeScore) {
            repairs.push({
                queueItemId: queueItem.id,
                score: authoritativeScore,
            });
        }
    }

    if (repairs.length > 0) {
        await batchUpdateQueueItemScores(repairs);
    }
}
