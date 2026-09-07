import type { RequestHandler } from "express";
import { voteSchema } from "./vote.schema.js";
import { voteOnQueueItem } from "./vote.service.js";
import { parseSpaceIdParams } from "../../middleware/space.middleware.js";
import { parseQueueItemIdParams } from "../queue/queue.controller.js";

export const voteController: RequestHandler = async (req, res) => {
    const input = voteSchema.parse(req.body);

    const { spaceId } = parseSpaceIdParams(req.params);
    const { queueItemId } = parseQueueItemIdParams(req.params);

    const result = await voteOnQueueItem(spaceId, queueItemId, res.locals.user.id, input.value);

    return res.status(200).json(result);
};
