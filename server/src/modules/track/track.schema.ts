import { z } from "zod";

export const createYoutubeTrackSchema = z.object({
    url: z.url("Invalid Youtube URL"),
});

export const createCustomTrackUploadSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    artist: z.string().trim().min(1, "Artist is required"),
});

export type CreateYoutubeTrackInput = z.infer<typeof createYoutubeTrackSchema>;
export type CreateCustomTrackUploadInput = z.infer<typeof createCustomTrackUploadSchema>;
