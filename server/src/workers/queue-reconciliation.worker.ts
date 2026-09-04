import { acquireLock, releaseLock } from "../infra/distributed-lock.js";
import { logger } from "../infra/logger.js";
import { reconcileSpaceQueue } from "../modules/queue/queue.reconciliation.js";
import { findSpacesWithActiveQueues } from "../modules/queue/queue.repository.js";

const RECONCILIATION_INTERVAL_MS = 60_000;
const LOCK_TTL_SECONDS = 30;

export async function reconcileActiveSpaces() {
    const spaces = await findSpacesWithActiveQueues();

    for (const space of spaces) {
        const lock = await acquireLock(`queue:reconciliation:${space.id}`, LOCK_TTL_SECONDS);

        if (!lock) {
            continue;
        }

        try {
            await reconcileSpaceQueue(space.id);
        } finally {
            await releaseLock(lock);
        }
    }
}

export async function startQueueReconciliationWorker() {
    while (true) {
        try {
            await reconcileActiveSpaces();
        } catch (error) {
            logger.error(
                {
                    err: error,
                },
                "Queue reconciliation cycle failed",
            );
        }

        await new Promise((resolve) => {
            setTimeout(resolve, RECONCILIATION_INTERVAL_MS);
        });
    }
}
