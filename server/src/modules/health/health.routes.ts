import { Router } from "express";
import { checkReadiness } from "./health.service.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

healthRouter.get("/ready", async (_req, res) => {
    const result = await checkReadiness();

    if (!result.ready) {
        return res.status(503).json(result);
    }

    return res.status(200).json(result);
});
