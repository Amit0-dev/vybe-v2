import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { createSpaceController } from "./space.controller.js";
import { asyncHandler } from "../../lib/async-handler.js";

export const spaceRouter = Router();

spaceRouter.post("/", requireAuth, asyncHandler(createSpaceController));
