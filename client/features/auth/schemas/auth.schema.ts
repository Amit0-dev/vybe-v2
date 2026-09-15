import { z } from "zod";

export const magicLinkSchema = z.object({
    email: z.email("Enter a valid email address"),
});

export type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;
