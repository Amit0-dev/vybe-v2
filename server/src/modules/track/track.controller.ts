import type { RequestHandler } from "express";
import { createYoutubeTrackSchema } from "./track.schema.js";
import { createYouTubeTrack } from "./track.service.js";

export const createYouTubeTrackController: RequestHandler = async (req, res) => {
    const input = createYoutubeTrackSchema.parse(req.body);

    const track = await createYouTubeTrack(input);

    return res.status(201).json({
        track: {
            id: track.id,
            title: track.title,
            artist: track.artist,
            durationSec: track.durationSec,
            source: track.source,
            sourceId: track.sourceId,
        },
    });
};
