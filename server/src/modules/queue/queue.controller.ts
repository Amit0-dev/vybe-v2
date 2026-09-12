import type { RequestHandler, Request } from "express";
import { addQueueItemSchema } from "./queue.schema.js";
import {
    addTrackToQueue,
    addYouTubeTrackToQueue,
    getQueue,
    skipQueueItem,
} from "./queue.service.js";
import { parseSpaceIdParams } from "../../middleware/space.middleware.js";
import { z } from "zod";
import { BadRequestError } from "../../lib/errors.js";
import { skipPlayback } from "../playback/playback.service.js";
import { createYoutubeTrackSchema } from "../track/track.schema.js";

const paramsSchema = z.object({
    queueItemId: z.string().trim().min(1, "queueItemId is missing"),
});

export function parseQueueItemIdParams(params: Request["params"]) {
    const parsed = paramsSchema.safeParse(params);

    if (!parsed.success) {
        throw new BadRequestError("Validation failed", "VALIDATION_FAILED");
    }

    return parsed.data;
}

export const addQueueItemController: RequestHandler = async (req, res) => {
    const input = addQueueItemSchema.parse(req.body);

    const { spaceId } = parseSpaceIdParams(req.params);

    const queueItem = await addTrackToQueue(spaceId, input.trackId, res.locals.user.id);

    return res.status(201).json({
        queueItem,
    });
};

export const getQueueController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const queue = await getQueue(spaceId);

    return res.status(200).json({
        queue,
    });
};

export const skipQueueItemController: RequestHandler = async (req, res) => {
    const { queueItemId } = parseQueueItemIdParams(req.params);
    const { spaceId } = parseSpaceIdParams(req.params);

    const queueItem = await skipPlayback(spaceId, queueItemId);

    return res.status(200).json({
        queueItem,
    });
};

export const addYouTubeQueueItemController: RequestHandler = async (req, res) => {
    const input = createYoutubeTrackSchema.parse(req.body);

    const { spaceId } = parseSpaceIdParams(req.params);

    const result = await addYouTubeTrackToQueue(spaceId, input.url, res.locals.user.id);

    return res.status(201).json(result);
};
