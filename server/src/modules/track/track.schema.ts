import { z } from "zod";

export const createYoutubeTrackSchema = z.object({
    url: z.url("Invalid Youtube URL"),
});

export type CreateYoutubeTrackInput = z.infer<typeof createYoutubeTrackSchema>;
