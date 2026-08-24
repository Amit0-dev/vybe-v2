import prisma from "../../infra/db.js";

export async function findUserById(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
        },
    });
}
