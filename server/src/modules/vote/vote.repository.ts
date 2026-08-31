import { Prisma } from "../../generated/prisma/client.js";


type DBClient = Prisma.TransactionClient;

export async function findQueueItemVote(db: DBClient, queueItemId: string, userId: string) {
    return db.queueItemVote.findUnique({
        where: {
            queueItemId_userId: {
                queueItemId,
                userId,
            },
        },
    });
}

export async function createQueueItemVote(
    db: DBClient,
    queueItemId: string,
    userId: string,
    value: -1 | 1,
) {
    return db.queueItemVote.create({
        data: {
            queueItemId,
            userId,
            value,
        },
    });
}

export async function updateQueueItemVote(db: DBClient, voteId: string, value: -1 | 1) {
    return db.queueItemVote.update({
        where: {
            id: voteId,
        },
        data: {
            value,
        },
    });
}

export async function deleteQueueItemVote(db: DBClient, voteId: string) {
    return db.queueItemVote.delete({
        where: {
            id: voteId,
        },
    });
}
