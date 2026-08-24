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
    source: "YOUTUBE";
    sourceId: string;
};

export async function createTrack(input: CreateTrackRecord) {
    return prisma.track.create({
        data: input,
    });
}
