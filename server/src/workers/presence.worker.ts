import { presenceWorkerLogger } from "../infra/logger.js";
import { handleUserDisconnected } from "../modules/playback/playback.service.js";
import { findActiveSpaces } from "../modules/queue/queue.repository.js";
import { cleanupExpiredPresence } from "../realtime/presence.service.js";
import { getLiveUsersCountInSpace } from "../realtime/presence.service.js";
import { publishRealtimeEvent } from "../realtime/publishRealtimeEvent.js";
import { RealtimeEvent } from "../realtime/realtime.events.js";

const PRESENCE_CLEANUP_INTERVAL_MS = 30_000;
let shouldStop = false;

export function stopPresenceWorker() {
    shouldStop = true;
}

async function cleanupPresence() {
    const spaces = await findActiveSpaces();

    for (const space of spaces) {
        const offlineUsers = await cleanupExpiredPresence(space.id);

        if (offlineUsers.length === 0) {
            continue;
        }

        presenceWorkerLogger.info(
            {
                spaceId: space.id,
                offlineUsers,
            },
            "Expired realtime presence cleaned up",
        );

        for (const userId of offlineUsers) {
            await handleUserDisconnected(space.id, userId);
        }

        await publishRealtimeEvent({
            type: RealtimeEvent.LIVE_USER_COUNT_UPDATED,
            spaceId: space.id,
            liveUserCount: await getLiveUsersCountInSpace(space.id),
        });
    }
}

export async function startPresenceWorker() {
    while (!shouldStop) {
        try {
            await cleanupPresence();
        } catch (error) {
            presenceWorkerLogger.error(
                {
                    err: error,
                },
                "Presence cleanup cycle failed",
            );
        }

        if (shouldStop) {
            break;
        }

        await new Promise((resolve) => {
            setTimeout(resolve, PRESENCE_CLEANUP_INTERVAL_MS);
        });
    }
}
