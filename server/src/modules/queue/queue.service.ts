import { logger } from "../../infra/logger.js";
import { addQueueItem } from "./queue.ranking.js";
import { createQueueItem, findActiveQueueItem } from "./queue.repository.js";

export async function addTrackToQueue(spaceId: string, trackId: string) {
    const existingQueueItem = await findActiveQueueItem(spaceId, trackId);

    if (existingQueueItem) {
        return existingQueueItem;
    }

    const queueItem = await createQueueItem(trackId, spaceId);

    try {
        await addQueueItem(spaceId, queueItem.id, queueItem.score);
    } catch (error) {
        logger.error(
            {
                error,
                queueItemId: queueItem.id,
                spaceId,
            },
            "Failed to initialize QueueItem in Redis ranking",
        );
    }

    return queueItem;
}
