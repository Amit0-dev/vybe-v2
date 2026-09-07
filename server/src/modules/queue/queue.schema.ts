import { z } from "zod";

export const addQueueItemSchema = z.object({
    trackId: z.string().min(1),
});

export type AddQueueItemInput = z.infer<typeof addQueueItemSchema>;
