import type { RequestHandler } from "express";
import { ForbiddenError } from "../lib/errors.js";
import { asyncHandler } from "../lib/async-handler.js";

const checkSpaceOwner: RequestHandler = async (_req, res, next) => {
    const membership = res.locals.spaceMembership;

    if (membership.role !== "OWNER") {
        throw new ForbiddenError(
            "Only the space owner can perform this action",
            "SPACE_OWNER_REQUIRED",
        );
    }

    next();
};

export const requireSpaceOwner = asyncHandler(checkSpaceOwner);
