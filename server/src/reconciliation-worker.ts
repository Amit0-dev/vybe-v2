import { connectInfra, disconnectInfra } from "./infra/index.js";
import { logger } from "./infra/logger.js";
import {
    startQueueReconciliationWorker,
    stopQueueReconciliationWorker,
} from "./workers/queue-reconciliation.worker.js";

let shuttingDown = false;

async function startWorker() {
    await connectInfra();

    logger.info("Queue reconciliation worker started");

    await startQueueReconciliationWorker();

    await disconnectInfra();

    logger.info("Queue reconciliation worker stopped");
}

async function shutdown(signal: string) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    logger.info(`${signal} received. Shutting down worker...`);

    stopQueueReconciliationWorker();
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
        "Queue reconciliation worker crashed",
    );
    
    await disconnectInfra();
    process.exit(1);
});
