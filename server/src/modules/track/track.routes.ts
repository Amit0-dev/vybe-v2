import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";

import {
    createCustomTrackUploadUrlController,
    createYouTubeTrackController,
} from "./track.controller.js";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import { asyncHandler } from "../../lib/async-handler.js";

export const trackRouter = Router();

trackRouter.post("/youtube", requireAuth, asyncHandler(createYouTubeTrackController));

trackRouter.post(
    "/custom/upload-url",
    requireAuth,
    requireAdmin,
    asyncHandler(createCustomTrackUploadUrlController),
);
