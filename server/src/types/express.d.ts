import { SpaceMember } from "../generated/prisma/client.ts";
import type { CurrentUser } from "./auth.ts";

declare global {
    namespace Express {
        interface Locals {
            user: CurrentUser;
            session: {
                id: string;
                userId: string;
                expiresAt: Date;
            };

            spaceMembership: SpaceMember
        }
    }
}

export {}