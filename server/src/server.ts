import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./infra/logger.js";
import { connectInfra, disconnectInfra } from "./infra/index.js";
import type { Server } from "node:http";

const app = createApp();

let server: Server | undefined;

try {
    await connectInfra();

    server = app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT}`);
    });
} catch (error) {
    logger.fatal(error, "Failed to start application");
    process.exit(1);
}

async function shutdown(signal: string) {
    logger.info(`${signal} received. Shutting down...`);

    if (server) {
        server.close(async () => {
            try {
                await disconnectInfra();

                logger.info("Application shutdown complete");
                process.exit(0);
            } catch (error) {
                logger.error(error, "Error during shutdown");
                process.exit(1);
            }
        });
    }
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});
process.on("SIGINT", () => {
    void shutdown("SIGINT");
});
