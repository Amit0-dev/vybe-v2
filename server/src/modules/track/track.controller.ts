import type { RequestHandler } from "express";
import {
    createCustomTrackUploadSchema,
    createYoutubeTrackSchema,
    getCustomTracksSchema,
} from "./track.schema.js";
import {
    createCustomTrackUploadUrl,
    createYouTubeTrack,
    getCustomTracks,
} from "./track.service.js";

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

export const createCustomTrackUploadUrlController: RequestHandler = async (req, res) => {
    const input = createCustomTrackUploadSchema.parse(req.body);

    const result = await createCustomTrackUploadUrl(input);

    return res.status(200).json(result);
};

export const getCustomTracksController: RequestHandler = async (req, res) => {
    const input = getCustomTracksSchema.parse(req.query);

    const result = await getCustomTracks(input);

    return res.status(200).json(result);
};
