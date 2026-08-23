import argon2 from "argon2";
import type { CreateSpaceInput, JoinSpaceInput } from "./space.schema.js";
import { generateJoinCode } from "./space.utils.js";
import {
    createMembership,
    createSpace as createSpaceRecord,
    findMembership,
    findSpaceByJoinCode,
} from "./space.repository.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../lib/errors.js";

const MAX_JOIN_CODE_ATTEMPTS = 3;

export async function createSpace(input: CreateSpaceInput, ownerId: string) {
    const joinPasswordHash = await argon2.hash(input.password);

    let joinCode: string;

    for (let attempt = 0; attempt < MAX_JOIN_CODE_ATTEMPTS; attempt++) {
        joinCode = generateJoinCode();

        try {
            return await createSpaceRecord({
                name: input.name,
                ownerId,
                joinCode,
                joinPasswordHash,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                continue;
            }

            throw error;
        }
    }

    throw new ConflictError("Unable to generate a unique join code", "JOIN_CODE_GENERATION_FAILED");
}

export async function joinSpace(input: JoinSpaceInput, userId: string) {
    const space = await findSpaceByJoinCode(input.joinCode);

    if (!space) {
        throw new NotFoundError("Space not found", "SPACE_NOT_FOUND");
    }

    if (space.status !== "ACTIVE") {
        throw new ConflictError("This space is no longer active", "SPACE_NOT_ACTIVE");
    }

    const passwordValid = await argon2.verify(space.joinPasswordHash, input.password);

    if (!passwordValid) {
        throw new UnauthorizedError("Invalid space credentials", "INVALID_SPACE_CREDENTIALS");
    }

    const existingMembership = await findMembership(space.id, userId);

    if (existingMembership) {
        throw new ConflictError("You are already a member of this space", "ALREADY_MEMBER");
    }

    return createMembership(userId, space.id);
}
