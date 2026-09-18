import { SpaceStatus } from "../../generated/prisma/enums.js";
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
            select: {
                id: true,
            }
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
        select: {
            id: true,
            role: true,
            spaceId: true,
            joinedAt: true,
            space: {
                select: {
                    name: true,
                },
            },
        },
    });
}

export async function findSpaceById(spaceId: string) {
    return prisma.space.findUnique({
        where: { id: spaceId },
        select: {
            id: true,
            name: true,
            joinCode: true,
            status: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function findSpaceMembers(spaceId: string) {
    return prisma.spaceMember.findMany({
        where: { spaceId },
        select: {
            id: true,
            role: true,
            joinedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            joinedAt: "asc",
        },
    });
}

export async function deleteMembership(spaceId: string, userId: string) {
    return prisma.spaceMember.delete({
        where: {
            spaceId_userId: {
                userId,
                spaceId,
            },
        },
    });
}

export async function closeSpace(spaceId: string) {
    return prisma.space.update({
        where: { id: spaceId },
        data: {
            status: "CLOSED",
        },
        select: {
            id: true,
            name: true,
            status: true,
            updatedAt: true,
        },
    });
}

export async function deactivateSpace(spaceId: string) {
    return prisma.space.updateMany({
        where: {
            id: spaceId,
            status: SpaceStatus.ACTIVE,
        },
        data: {
            status: SpaceStatus.CLOSED,
        },
    });
}

export async function findSpacesByUserId(userId: string) {
    return prisma.spaceMember.findMany({
        where: { userId },
        select: {
            role: true,
            joinedAt: true,
            space: {
                select: {
                    id: true,
                    name: true,
                    joinCode: true,
                    status: true,
                    createdAt: true,
                    owner: {
                        select: {
                            name: true,
                            email: true,
                            image: true,
                        }
                    },
                },
            },
        },
    });
}
