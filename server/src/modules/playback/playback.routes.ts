import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireSpaceMember } from "../../middleware/space.middleware.js";
import { requireSpaceOwner } from "../../middleware/space-owner.middleware.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { completePlaybackController, startPlaybackController } from "./playback.controller.js";

export const playbackRouter = Router();

playbackRouter.post(
    "/:spaceId/playback/start",
    requireAuth,
    requireSpaceMember,
    requireSpaceOwner,
    asyncHandler(startPlaybackController),
);

playbackRouter.post(
    "/:spaceId/playback/:queueItemId/complete",
    requireAuth,
    requireSpaceMember,
    requireSpaceOwner,
    asyncHandler(completePlaybackController),
);