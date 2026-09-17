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

export const joinSpaceSchema = z.object({
    joinCode: z.string().trim().min(1, "Join code is required").max(20, "Invalid join code"),

    password: z.string().min(1, "Password is required").max(100),
});

export type JoinSpaceInput = z.infer<typeof joinSpaceSchema>;
export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
