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
        }
    }
}

export {}