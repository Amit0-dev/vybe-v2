import { SpaceStatus } from "../../generated/prisma/enums.js";
import { isUserConnectedToSpace } from "../../realtime/realtime.manager.js";
import { deactivateSpace, findSpaceById } from "../space/space.repository.js";
import { clearOwnerOffline, getOfflineSpaces, getOwnerOfflineAt } from "./playback.presence.js";
import { shutdownPlayback } from "./playback.service.js";

const OWNER_RECOVERY_WINDOW_MS = 5 * 60 * 1000;

export async function handleOwnerRecovery() {
    const spaceIds = await getOfflineSpaces();

    const now = Date.now();

    for (const spaceId of spaceIds) {
        const disconnectedAt = await getOwnerOfflineAt(spaceId);

        if (disconnectedAt === null) {
            continue;
        }

        const elapsed = now - disconnectedAt;

        if (elapsed < OWNER_RECOVERY_WINDOW_MS) {
            continue;
        }

        // Owner recovery window expired.
        const space = await findSpaceById(spaceId);

        if (!space) {
            await clearOwnerOffline(spaceId);
            continue;
        }

        if (space.status !== SpaceStatus.ACTIVE) {
            await clearOwnerOffline(spaceId);
            continue;
        }

        const ownerConnected = isUserConnectedToSpace(spaceId, space.ownerId);

        if (ownerConnected) {
            await clearOwnerOffline(spaceId);
            continue;
        }

        await shutdownPlayback(spaceId);

        await deactivateSpace(spaceId);

        await clearOwnerOffline(spaceId);
    }
}
