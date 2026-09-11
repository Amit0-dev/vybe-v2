import { redis } from "../../infra/redis.js";

const OWNER_OFFLINE_SET = "playback:owner-offline-spaces";

function getOwnerOfflineKey(spaceId: string) {
    return `playback:owner-offline:${spaceId}`;
}

export async function markOwnerOffline(spaceId: string) {
    const result = await redis.set(getOwnerOfflineKey(spaceId), Date.now().toString(), {
        condition: "NX",
    });

    if (result === "OK") {
        await redis.sAdd(OWNER_OFFLINE_SET, spaceId);
    }
}

export async function clearOwnerOffline(spaceId: string) {
    await redis.del(getOwnerOfflineKey(spaceId));
    await redis.sRem(OWNER_OFFLINE_SET, spaceId);
}

export async function getOwnerOfflineAt(spaceId: string) {
    const value = await redis.get(getOwnerOfflineKey(spaceId));

    if (!value) {
        return null;
    }

    return Number(value);
}

export async function getOfflineSpaces() {
    return redis.sMembers(OWNER_OFFLINE_SET);
}
