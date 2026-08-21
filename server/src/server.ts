import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./infra/logger.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
});

function shutdown(signal: string) {
    logger.info(`${signal} received. Shutting down...`);

    server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
