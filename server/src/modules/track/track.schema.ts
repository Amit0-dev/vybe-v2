import { z } from "zod";

export const createYoutubeTrackSchema = z.object({
    url: z.url("Invalid Youtube URL"),
});

export const createCustomTrackUploadSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    artist: z.string().trim().min(1, "Artist is required"),
});

export const getCustomTracksSchema = z.object({
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type GetCustomTracksInput = z.infer<typeof getCustomTracksSchema>;
export type CreateYoutubeTrackInput = z.infer<typeof createYoutubeTrackSchema>;
export type CreateCustomTrackUploadInput = z.infer<typeof createCustomTrackUploadSchema>;
