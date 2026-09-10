import { acquireLock, releaseLock } from "../infra/distributed-lock.js";
import { logger } from "../infra/logger.js";
import { reconcileSpaceQueue } from "../modules/queue/queue.reconciliation.js";
import {
    clearSpaceReconciliation,
    findPendingReconciliationSpaces,
    findSpacesWithActiveQueues,
} from "../modules/queue/queue.repository.js";

const RECONCILIATION_INTERVAL_MS = 60_000;
const LOCK_TTL_SECONDS = 30;

export async function reconcileSpaces() {
    const activeSpaces = await findSpacesWithActiveQueues();

    const pendingSpaces = await findPendingReconciliationSpaces();

    const spaceIds = new Set<string>([
        ...activeSpaces.map((space) => space.id),
        ...pendingSpaces.map((space) => space.spaceId),
    ]);

    for (const spaceId of spaceIds) {
        const lock = await acquireLock(`queue:reconciliation:${spaceId}`, LOCK_TTL_SECONDS);

        if (!lock) {
            continue;
        }

        try {
            await reconcileSpaceQueue(spaceId);
            await clearSpaceReconciliation(spaceId);
        } 
        catch (error) {
            logger.error(
                {
                    err: error,
                    spaceId,
                },
                "Space reconciliation failed",
            );
        }
        finally {
            await releaseLock(lock);
        }
    }
}

export async function startQueueReconciliationWorker() {
    while (true) {
        try {
            await reconcileSpaces();
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
