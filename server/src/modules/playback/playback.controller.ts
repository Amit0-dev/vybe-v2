import type { RequestHandler } from "express";
import { parseSpaceIdParams } from "../../middleware/space.middleware.js";
import { completePlayback, getPlaybackState, startPlayback } from "./playback.service.js";
import { parseQueueItemIdParams } from "../queue/queue.controller.js";

export const startPlaybackController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const queueItem = await startPlayback(spaceId);

    return res.status(200).json({
        queueItem,
    });
};

export const completePlaybackController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);
    const { queueItemId } = parseQueueItemIdParams(req.params);

    const queueItem = await completePlayback(spaceId, queueItemId);

    return res.status(200).json({
        queueItem,
    });
};

export const getPlaybackStateController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const queueItem = await getPlaybackState(spaceId);

    res.status(200).json({
        queueItem,
    });
};
