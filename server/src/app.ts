import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { healthRouter } from "./modules/health/health.routes.js";

export function createApp() {
    const app = express();

    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(healthRouter)

    return app;
}
