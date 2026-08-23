import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../lib/errors.js";
import type { CurrentUser } from "../types/auth.js";
import { asyncHandler } from "../lib/async-handler.js";

const authenticate: RequestHandler = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        throw new UnauthorizedError();
    }

    const user: CurrentUser = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image ?? null,
    };

    res.locals.user = user;
    res.locals.session = session.session;

    next();
};

export const requireAuth = asyncHandler(authenticate);
