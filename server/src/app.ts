import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { healthRouter } from "./modules/health/health.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { spaceRouter } from "./modules/space/space.routes.js";
import { trackRouter } from "./modules/track/track.routes.js";
import { queueRouter } from "./modules/queue/queue.routes.js";
import { voteRouter } from "./modules/vote/vote.routes.js";
import { playbackRouter } from "./modules/playback/playback.routes.js";

export function createApp() {
    const app = express();

    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
    );

    app.all("/api/auth/*splat", toNodeHandler(auth));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(healthRouter);
    app.use("/api/user", authRouter);
    app.use("/api/spaces", spaceRouter)
    app.use("/api/tracks", trackRouter);
    app.use("/api/spaces", queueRouter);
    app.use("/api/spaces", voteRouter);
    app.use("/api/spaces", playbackRouter);

    app.use(errorHandler);

    return app;
}
