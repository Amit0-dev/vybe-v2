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
