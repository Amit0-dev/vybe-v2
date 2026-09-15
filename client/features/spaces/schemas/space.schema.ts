import { z } from "zod";

export const createSpaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Space name is required")
        .max(100, "Space name must be 100 characters or less"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be 100 characters or less"),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
