import prisma from "../../infra/db.js";

type CreateSpaceRecord = {
    ownerId: string;
    name: string;
    joinCode: string;
    joinPasswordHash: string;
};

export async function createSpace(input: CreateSpaceRecord) {
    return prisma.$transaction(async (tx) => {
        const space = await tx.space.create({
            data: input,
        });

        await tx.spaceMember.create({
            data: {
                spaceId: space.id,
                userId: input.ownerId,
                role: "OWNER",
            },
        });

        return space;
    });
}

export async function findSpaceByJoinCode(joinCode: string) {
    return prisma.space.findUnique({
        where: { joinCode },
    });
}

export async function findMembership(spaceId: string, userId: string) {
    return prisma.spaceMember.findUnique({
        where: {
            spaceId_userId: {
                spaceId,
                userId,
            },
        },
    });
}

export async function createMembership(userId: string, spaceId: string) {
    return prisma.spaceMember.create({
        data: {
            spaceId,
            userId,
            role: "PARTICIPANT",
        },
    });
}
