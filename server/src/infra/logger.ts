import pino from "pino";
import { env } from "../config/env.js";

export function createLogger(service: string) {
    return pino({
        level: env.LOG_LEVEL,

        base: {
            service,
        },

        ...(env.NODE_ENV === "development" && {
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            },
        }),
    });
}

export const apiLogger = createLogger("api");

export const presenceWorkerLogger = createLogger("presence-worker");

export const queueReconciliationLogger = createLogger("queue-reconciliation-worker");

export const customTrackWorkerLogger = createLogger("custom-track-worker");
