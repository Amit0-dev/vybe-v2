import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
    closeSpaceController,
    createSpaceController,
    getSpaceController,
    getSpaceMembersController,
    getSpacesController,
    joinSpaceController,
    leaveSpaceController,
    reopenSpaceController,
} from "./space.controller.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireSpaceMember } from "../../middleware/space.middleware.js";
import { requireSpaceOwner } from "../../middleware/space-owner.middleware.js";
import { rateLimiter } from "../../middleware/rateLimiter.js";

export const spaceRouter = Router();

// Rate-Limiter
const joinSpaceRateLimit = rateLimiter({
    limit: 30,
    windowSeconds: 60,
    keyGenerator: (_req, res) => `join-space:user:${res.locals.user.id}`,
});

spaceRouter.post("/", requireAuth, asyncHandler(createSpaceController));

spaceRouter.get("/", requireAuth, asyncHandler(getSpacesController));

spaceRouter.post("/join", requireAuth, joinSpaceRateLimit, asyncHandler(joinSpaceController));

spaceRouter.get("/:spaceId", requireAuth, requireSpaceMember, asyncHandler(getSpaceController));

spaceRouter.get(
    "/:spaceId/members",
    requireAuth,
    requireSpaceMember,
    asyncHandler(getSpaceMembersController),
);

spaceRouter.delete(
    "/:spaceId/leave",
    requireAuth,
    requireSpaceMember,
    asyncHandler(leaveSpaceController),
);

spaceRouter.post(
    "/:spaceId/close",
    requireAuth,
    requireSpaceMember,
    requireSpaceOwner,
    asyncHandler(closeSpaceController),
);

spaceRouter.post(
    "/:spaceId/reopen",
    requireAuth,
    requireSpaceMember,
    requireSpaceOwner,
    asyncHandler(reopenSpaceController),
);

// TODO: add update space route
// TODO: add delete space route
// TODO: add remove member route (space owner only)
