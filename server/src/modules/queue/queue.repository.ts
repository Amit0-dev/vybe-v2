import { Prisma } from "../../generated/prisma/client.js";
import { QueueItemStatus } from "../../generated/prisma/enums.js";
import prisma from "../../infra/db.js";

export async function findQueueItemById(queueItemId: string) {
    return prisma.queueItem.findUnique({
        where: {
            id: queueItemId,
        },
    });
}

export async function findActiveQueueItem(spaceId: string, trackId: string) {
    return prisma.queueItem.findFirst({
        where: {
            spaceId,
            trackId,
            status: {
                in: [QueueItemStatus.QUEUED, QueueItemStatus.PLAYING],
            },
        },
    });
}

export async function createQueueItem(trackId: string, spaceId: string) {
    return prisma.queueItem.create({
        data: {
            spaceId,
            trackId,
        },
    });
}

export async function findQueueItemsForRanking(spaceId: string) {
    return prisma.queueItem.findMany({
        where: {
            spaceId,
            status: {
                in: [QueueItemStatus.QUEUED, QueueItemStatus.PLAYING],
            },
        },
        select: {
            id: true,
            score: true,
        },
    });
}

export async function findQueueItemVoteTotals(spaceId: string) {
    return prisma.queueItemVote.groupBy({
        by: ["queueItemId"],
        where: {
            queueItem: {
                spaceId,
                status: {
                    in: [QueueItemStatus.QUEUED, QueueItemStatus.PLAYING],
                },
            },
        },
        _sum: {
            value: true,
        },
    });
}

export async function updateQueueItemScore(queueItemId: string, score: number) {
    return prisma.queueItem.update({
        where: {
            id: queueItemId,
        },
        data: {
            score,
        },
    });
}

const SCORE_UPDATE_BATCH_SIZE = 500;

export async function batchUpdateQueueItemScores(
    updates: Array<{
        queueItemId: string;
        score: number;
    }>,
) {
    for (let i = 0; i < updates.length; i += SCORE_UPDATE_BATCH_SIZE) {

        const batch = updates.slice(i, i + SCORE_UPDATE_BATCH_SIZE);

        const cases = batch.map(
            ({ queueItemId, score }) => Prisma.sql`WHEN ${queueItemId} THEN ${score}`,
        );

        const ids = batch.map(({ queueItemId }) => queueItemId);

        await prisma.$executeRaw`
            UPDATE "QueueItem"
            SET "score" = CASE "id"
                ${Prisma.join(cases, " ")}
            END
            WHERE "id" IN (${Prisma.join(ids)});
        `;
    }
}
