import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireSpaceMember } from "../../middleware/space.middleware.js";
import { asyncHandler } from "../../lib/async-handler.js";
import {
    addQueueItemController,
    addYouTubeQueueItemController,
    getQueueController,
    skipQueueItemController,
} from "./queue.controller.js";
import { requireSpaceOwner } from "../../middleware/space-owner.middleware.js";

export const queueRouter = Router();

queueRouter.post(
    "/:spaceId/queue/youtube",
    requireAuth,
    requireSpaceMember,
    asyncHandler(addYouTubeQueueItemController),
);

queueRouter.post(
    "/:spaceId/queue",
    requireAuth,
    requireSpaceMember,
    asyncHandler(addQueueItemController),
);

queueRouter.get(
    "/:spaceId/queue",
    requireAuth,
    requireSpaceMember,
    asyncHandler(getQueueController),
);

queueRouter.post(
    "/:spaceId/queue/:queueItemId/skip",
    requireAuth,
    requireSpaceMember,
    requireSpaceOwner,
    asyncHandler(skipQueueItemController),
);