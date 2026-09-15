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
} from "./space.controller.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireSpaceMember } from "../../middleware/space.middleware.js";
import { requireSpaceOwner } from "../../middleware/space-owner.middleware.js";

export const spaceRouter = Router();

spaceRouter.post("/", requireAuth, asyncHandler(createSpaceController));

spaceRouter.get("/", requireAuth, asyncHandler(getSpacesController));

spaceRouter.post("/join", requireAuth, asyncHandler(joinSpaceController));

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


// TODO: add update space route
// TODO: add delete space route
// TODO: add remove member route (space owner only)