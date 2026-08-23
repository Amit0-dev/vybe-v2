import type { RequestHandler, Request } from "express";
import { findMembership } from "../modules/space/space.repository.js";
import { z } from "zod";
import { BadRequestError, ForbiddenError } from "../lib/errors.js";
import { asyncHandler } from "../lib/async-handler.js";

const paramsSchema = z.object({
    spaceId: z.string().trim().min(1, "spaceId is missing"),
});

export function parseSpaceIdParams(params: Request["params"]) {
    const parsed = paramsSchema.safeParse(params);

    if (!parsed.success) {
        throw new BadRequestError("Validation failed", "VALIDATION_FAILED");
    }

    return parsed.data;
}

const checkSpaceMember: RequestHandler = async (req, res, next) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const userId = res.locals.user.id;

    const membership = await findMembership(spaceId, userId);

    if (!membership) {
        throw new ForbiddenError("You are not a member of this space", "SPACE_MEMBERSHIP_REQUIRED");
    }

    res.locals.spaceMembership = membership;

    next();
};

export const requireSpaceMember = asyncHandler(checkSpaceMember);
