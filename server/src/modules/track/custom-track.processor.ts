import { parseBuffer } from "music-metadata";
import { getObjectBuffer, getObjectMetadata } from "../../integrations/storage/s3.client.js";
import { NotFoundError, UnprocessableEntityError } from "../../lib/errors.js";
import {
    createTrack,
    deleteCustomTrackUpload,
    findCustomTrackUploadByStorageKey,
    findTrackByStorageKey,
} from "./track.repository.js";
import { Prisma } from "../../generated/prisma/client.js";
import { env } from "../../config/env.js";

type ProcessCustomTrackInput = {
    storageKey: string;
};

const maxSize = env.MAX_CUSTOM_TRACK_SIZE_MB * 1024 * 1024;

export async function processCustomTrack(input: ProcessCustomTrackInput) {
    if (!input.storageKey.startsWith("custom/") || !input.storageKey.endsWith(".mp3")) {
        throw new UnprocessableEntityError(
            "Invalid custom track storage key",
            "INVALID_CUSTOM_TRACK_STORAGE_KEY",
        );
    }

    const existingTrack = await findTrackByStorageKey(input.storageKey);

    if (existingTrack) {
        const upload = await findCustomTrackUploadByStorageKey(input.storageKey);

        if (upload) {
            await deleteCustomTrackUpload(upload.id);
        }

        return existingTrack;
    }

    const upload = await findCustomTrackUploadByStorageKey(input.storageKey);
   

    if (!upload) {
        throw new NotFoundError("Custom track upload not found", "CUSTOM_TRACK_UPLOAD_NOT_FOUND");
    }

    const objectMetadata = await getObjectMetadata(input.storageKey);

    if (objectMetadata.ContentLength === undefined || objectMetadata.ContentLength <= 0) {
        throw new UnprocessableEntityError(
            "Unable to determine uploaded file size",
            "CUSTOM_TRACK_SIZE_UNAVAILABLE",
        );
    }

    if (objectMetadata.ContentLength > maxSize) {
        throw new UnprocessableEntityError(
            "Custom track exceeds the maximum allowed file size",
            "CUSTOM_TRACK_FILE_TOO_LARGE",
        );
    }

    const buffer = await getObjectBuffer(input.storageKey);

    const metadata = await parseBuffer(buffer, {
        mimeType: "audio/mpeg",
    });

    const duration = metadata.format.duration;
   

    if (!duration || !Number.isFinite(duration) || duration <= 0) {
        throw new UnprocessableEntityError(
            "Unable to determine audio duration",
            "CUSTOM_TRACK_DURATION_UNAVAILABLE",
        );
    }

    const durationSec = Math.round(duration);

    try {
        const track = await createTrack({
            title: upload.title,
            artist: upload.artist,
            durationSec,
            source: "CUSTOM",
            sourceId: null,
            storageKey: input.storageKey,
        });

        await deleteCustomTrackUpload(upload.id);

        return track;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            const existingTrack = await findTrackByStorageKey(input.storageKey);

            if (existingTrack) {
                await deleteCustomTrackUpload(upload.id);
                return existingTrack;
            }
        }

        throw error;
    }
}
