import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireSpaceMember } from "../../middleware/space.middleware.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { voteController } from "./vote.controller.js";

export const voteRouter = Router();

voteRouter.post(
    "/:spaceId/queue/:queueItemId/vote",
    requireAuth,
    requireSpaceMember,
    asyncHandler(voteController),
);
