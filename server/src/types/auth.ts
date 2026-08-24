import type { UserRole } from "../generated/prisma/client.js";

export type CurrentUser = {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
};
