import { connectWorkerInfra, disconnectWorkerInfra } from "./infra/index.js";
import { queueReconciliationLogger } from "./infra/logger.js";
import {
    startQueueReconciliationWorker,
    stopQueueReconciliationWorker,
} from "./workers/queue-reconciliation.worker.js";

let shuttingDown = false;

async function startWorker() {
    await connectWorkerInfra();

    queueReconciliationLogger.info("Queue reconciliation worker started");

    await startQueueReconciliationWorker();

    await disconnectWorkerInfra();

    queueReconciliationLogger.info("Queue reconciliation worker stopped");
}

async function shutdown(signal: string) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    queueReconciliationLogger.info(`${signal} received. Shutting down worker...`);

    stopQueueReconciliationWorker();
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

startWorker().catch(async (error) => {
    queueReconciliationLogger.fatal(
        {
            err: error,
        },
        "Queue reconciliation worker crashed",
    );

    await disconnectWorkerInfra();
    process.exit(1);
});
