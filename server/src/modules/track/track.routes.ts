import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";

import { createYouTubeTrackController } from "./track.controller.js";

export const trackRouter = Router();

trackRouter.post("/youtube", requireAuth, createYouTubeTrackController);
