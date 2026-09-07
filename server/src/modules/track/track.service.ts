import { Prisma } from "../../generated/prisma/client.js";
import { generateUploadUrl } from "../../integrations/storage/s3.client.js";
import { getYoutubeVideo } from "../../integrations/youtube/youtube.client.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import {
    createCustomTrackUpload,
    createTrack,
    deleteCustomTrackUpload,
    findYouTubeTrack,
} from "./track.repository.js";
import { type CreateCustomTrackUploadInput, CreateYoutubeTrackInput } from "./track.schema.js";
import { extractYoutubeVideoId, generateCustomTrackStorageKey } from "./track.utils.js";

export async function createYouTubeTrack(input: CreateYoutubeTrackInput) {
    const videoId = extractYoutubeVideoId(input.url);

    if (!videoId) {
        throw new BadRequestError("Invalid Youtube URL", "INVALID_YOUTUBE_URL");
    }

    const existingTrack = await findYouTubeTrack(videoId);

    if (existingTrack) {
        return existingTrack;
    }

    const video = await getYoutubeVideo(videoId);

    if (!video) {
        throw new NotFoundError("YouTube video not found", "YOUTUBE_VIDEO_NOT_FOUND");
    }

    try {
        return await createTrack({
            title: video.title,
            artist: video.channelTitle,
            durationSec: video.durationSec,
            source: "YOUTUBE",
            sourceId: video.id,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            const existingTrack = await findYouTubeTrack(video.id);

            if (existingTrack) {
                return existingTrack;
            }
        }

        throw error;
    }
}

export async function createCustomTrackUploadUrl(input: CreateCustomTrackUploadInput) {
    const storageKey = generateCustomTrackStorageKey();

    const upload = await createCustomTrackUpload({
        title: input.title,
        artist: input.artist,
        storageKey,
    });

    try {
        const uploadUrl = await generateUploadUrl(storageKey);

        return {
            uploadId: upload.id,
            uploadUrl,
            storageKey,
        };
    } catch (error) {
        await deleteCustomTrackUpload(upload.id);
        throw error;
    }
}
