import argon2 from "argon2";
import type { CreateSpaceInput } from "./space.schema.js";
import { generateJoinCode } from "./space.utils.js";
import { createSpace as createSpaceRecord } from "./space.repository.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ConflictError } from "../../lib/errors.js";

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
