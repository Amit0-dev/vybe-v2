import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../lib/errors.js";
import type { CurrentUser } from "../types/auth.js";
import { asyncHandler } from "../lib/async-handler.js";
import { findUserById } from "../modules/auth/auth.repository.js";

const authenticate: RequestHandler = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        throw new UnauthorizedError();
    }

    const dbUser = await findUserById(session.user.id);

    if (!dbUser) {
        throw new UnauthorizedError();
    }

    const user: CurrentUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        image: dbUser.image,
        role: dbUser.role,
    };

    res.locals.user = user;
    res.locals.session = session.session;

    next();
};

export const requireAuth = asyncHandler(authenticate);
