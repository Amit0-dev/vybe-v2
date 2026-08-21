import type { ErrorRequestHandler } from "express";
import { env } from "../config/env.js";
import { logger } from "../infra/logger.js";
import { AppError } from "../lib/errors.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });
    }

    logger.error(
        {
            err: error,
            method: req.method,
            path: req.originalUrl,
        },
        "Unhandled application error",
    );

    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message:
                env.NODE_ENV === "production"
                    ? "Something went wrong"
                    : error instanceof Error
                      ? error.message
                      : "Unknown error",
        },
    });
};
