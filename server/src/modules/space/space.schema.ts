import { z } from "zod";

export const createSpaceSchema = z.object({
    name: z.string().trim().min(1, "Space name is required").max(100, "Space name is too long"),
    password: z
        .string()
        .min(6, "Space password must be at least 6 characters")
        .max(100, "Space password is too long"),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
