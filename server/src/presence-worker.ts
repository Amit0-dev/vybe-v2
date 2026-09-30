import { connectWorkerInfra, disconnectWorkerInfra } from "./infra/index.js";
import { presenceWorkerLogger } from "./infra/logger.js";
import { startPresenceWorker, stopPresenceWorker } from "./workers/presence.worker.js";

let shuttingDown = false;

async function startWorker() {
    await connectWorkerInfra();

    presenceWorkerLogger.info("Presence worker started");

    await startPresenceWorker();

    await disconnectWorkerInfra();

    presenceWorkerLogger.info("Presence worker stopped");
}

async function shutdown(signal: string) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    presenceWorkerLogger.info(`${signal} received. Shutting down presence worker...`);

    stopPresenceWorker();
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

startWorker().catch(async (error) => {
    presenceWorkerLogger.fatal(
        {
            err: error,
        },
        "Presence worker crashed",
    );

    await disconnectWorkerInfra();
    process.exit(1);
});
