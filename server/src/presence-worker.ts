import { connectWorkerInfra, disconnectWorkerInfra } from "./infra/index.js";
import { logger } from "./infra/logger.js";
import { redisPublisher } from "./infra/redis.js";
import { startPresenceWorker, stopPresenceWorker } from "./workers/presence.worker.js";

let shuttingDown = false;

async function startWorker() {
    await connectWorkerInfra();

    logger.info("Presence worker started");

    await startPresenceWorker();

    await disconnectWorkerInfra();

    logger.info("Presence worker stopped");
}

async function shutdown(signal: string) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    logger.info(`${signal} received. Shutting down presence worker...`);

    stopPresenceWorker();
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

startWorker().catch(async (error) => {
    logger.fatal(
        {
            err: error,
        },
        "Presence worker crashed",
    );

    await disconnectWorkerInfra();
    process.exit(1);
});
