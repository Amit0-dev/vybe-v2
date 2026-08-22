import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { healthRouter } from "./modules/health/health.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authRouter } from "./modules/auth/auth.routes.js";

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
    app.use("/api", authRouter);

    app.use(errorHandler);

    return app;
}
