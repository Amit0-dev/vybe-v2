import { logger } from "./infra/logger.js";
import { startQueueReconciliationWorker } from "./workers/queue-reconciliation.worker.js";

async function startWorker() {
    logger.info("Queue reconciliation worker started");

    await startQueueReconciliationWorker();
}

startWorker().catch((error) => {
    logger.fatal(
        {
            err: error,
        },
        "Queue reconciliation worker crashed",
    );

    process.exit(1);
});
