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
