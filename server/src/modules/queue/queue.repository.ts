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
            ({ queueItemId, score }) => Prisma.sql`WHEN ${queueItemId} THEN ${score}::integer`,
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

export async function findSpacesWithActiveQueues() {
    return prisma.space.findMany({
        where: {
            queueItems: {
                some: {
                    status: {
                        in: [QueueItemStatus.QUEUED, QueueItemStatus.PLAYING],
                    },
                },
            },
        },
        select: {
            id: true,
        },
    });
}

export async function findQueueItemsByIds(queueItemIds: string[]) {
    return prisma.queueItem.findMany({
        where: {
            id: {
                in: queueItemIds,
            },
        },
        include: {
            track: true,
        },
    });
}

export async function transitionQueueItemStatus(
    queueItemId: string,
    currentStatus: QueueItemStatus,
    nextStatus: QueueItemStatus,
) {
    return prisma.queueItem.updateMany({
        where: {
            id: queueItemId,
            status: currentStatus,
        },
        data: {
            status: nextStatus,
        },
    });
}

export async function findQueueItemInSpace(queueItemId: string, spaceId: string) {
    return prisma.queueItem.findFirst({
        where: {
            id: queueItemId,
            spaceId,
        },
    });
}

export async function findQueueItemForVote(queueItemId: string) {
    return prisma.queueItem.findUnique({
        where: { id: queueItemId },
        select: {
            id: true,
            spaceId: true,
            status: true,
        },
    });
}

// for dirty marker

export async function markSpaceForReconciliation(spaceId: string) {
    return prisma.queueReconciliation.upsert({
        where: {
            spaceId,
        },
        create: {
            spaceId,
        },
        update: {},
    });
}

export async function findPendingReconciliationSpaces() {
    return prisma.queueReconciliation.findMany({
        select: {
            spaceId: true,
        },
    });
}

export async function clearSpaceReconciliation(spaceId: string) {
    return prisma.queueReconciliation.deleteMany({
        where: {
            spaceId,
        },
    });
}
