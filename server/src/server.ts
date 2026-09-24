import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./infra/logger.js";
import { connectInfra, disconnectInfra } from "./infra/index.js";
import type { Server } from "node:http";
import { closeRealtime, initializeRealtime } from "./realtime/realtime.server.js";
import { subscribeToRealtimeEvents } from "./realtime/realtime.pubsub.js";

const app = createApp();

let server: Server | undefined;

try {
    await connectInfra();
    await subscribeToRealtimeEvents();

    server = app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT}`);
    });

    initializeRealtime(server);
} catch (error) {
    logger.fatal(error, "Failed to start application");
    process.exit(1);
}

async function shutdown(signal: string) {
    logger.info(`${signal} received. Shutting down...`);

    try {
        await closeRealtime();

        if (server) {
            await new Promise<void>((resolve, reject) => {
                server.close((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                });
            });
        }

        await disconnectInfra();

        logger.info("Application shutdown complete");
        process.exit(0);
    } catch (error) {
        logger.error({ err: error }, "Error during shutdown");
        process.exit(1);
    }
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});
process.on("SIGINT", () => {
    void shutdown("SIGINT");
});
