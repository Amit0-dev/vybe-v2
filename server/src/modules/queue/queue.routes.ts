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
import { rateLimiter } from "../../middleware/rateLimiter.js";

export const queueRouter = Router();

const queueRateLimit = rateLimiter({
    limit: 10,
    windowSeconds: 60,
    keyGenerator: (_req, res) =>
        `youtube-queue:user:${res.locals.user.id}`,
});

queueRouter.post(
    "/:spaceId/queue/youtube",
    requireAuth,
    requireSpaceMember,
    queueRateLimit,
    asyncHandler(addYouTubeQueueItemController),
);

queueRouter.post(
    "/:spaceId/queue",
    requireAuth,
    requireSpaceMember,
    queueRateLimit,
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