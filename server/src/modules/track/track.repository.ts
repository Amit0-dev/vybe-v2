import prisma from "../../infra/db.js";

export async function findYouTubeTrack(sourceId: string) {
    return prisma.track.findUnique({
        where: {
            source_sourceId: {
                source: "YOUTUBE",
                sourceId,
            },
        },
    });
}

type CreateTrackRecord = {
    title: string;
    artist: string | null;
    durationSec: number;
    source: "YOUTUBE" | "CUSTOM";
    sourceId: string | null;
    storageKey?: string | null;
};

export async function createTrack(input: CreateTrackRecord) {
    return prisma.track.create({
        data: input,
    });
}

export async function createCustomTrackUpload(data: {
    title: string;
    artist?: string;
    storageKey: string;
}) {
    return prisma.customTrackUpload.create({
        data,
    });
}

export async function findCustomTrackUploadByStorageKey(storageKey: string) {
    return prisma.customTrackUpload.findUnique({
        where: {
            storageKey,
        },
    });
}

export async function deleteCustomTrackUpload(id: string) {
    return prisma.customTrackUpload.delete({
        where: { id },
    });
}

export async function findTrackByStorageKey(storageKey: string) {
    return prisma.track.findUnique({
        where: { storageKey },
    });
}

export async function findTrackById(id: string) {
    return prisma.track.findUnique({
        where: { id },
    });
}
