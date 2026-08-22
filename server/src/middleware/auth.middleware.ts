import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { AppError } from "../lib/errors.js";
import type { CurrentUser } from "../types/auth.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            throw new AppError("Authentication required", 401, "UNAUTHORIZED");
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
    } catch (error) {
        next(error);
    }
};
