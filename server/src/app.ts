import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

    app.get("/health", (_req, res) => {
        res.status(200).json({
            status: "ok",
        });
    });

    return app;
}
