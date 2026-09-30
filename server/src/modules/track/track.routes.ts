import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";

import {
    createCustomTrackUploadUrlController,
    createYouTubeTrackController,
    getCustomTracksController,
} from "./track.controller.js";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { rateLimiter } from "../../middleware/rateLimiter.js";

export const trackRouter = Router();

const customUploadRateLimit = rateLimiter({
    limit: 30,
    windowSeconds: 60,
    keyGenerator: (_req, res) =>
        `custom-upload:user:${res.locals.user.id}`,
});

trackRouter.post("/youtube", requireAuth, asyncHandler(createYouTubeTrackController));

trackRouter.post(
    "/custom/upload-url",
    requireAuth,
    requireAdmin,
    customUploadRateLimit,
    asyncHandler(createCustomTrackUploadUrlController),
);

trackRouter.get("/custom", requireAuth, asyncHandler(getCustomTracksController));
