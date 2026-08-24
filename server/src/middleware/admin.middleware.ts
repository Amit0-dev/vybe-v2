import type { RequestHandler } from "express";
import { ForbiddenError } from "../lib/errors.js";
import { asyncHandler } from "../lib/async-handler.js";

const checkAdmin: RequestHandler = async (_req, res, next) => {
    const user = res.locals.user;

    if (user.role !== "ADMIN") {
        throw new ForbiddenError("Admin access required", "ADMIN_ACCESS_REQUIRED");
    }

    next();
};

export const requireAdmin = asyncHandler(checkAdmin);
