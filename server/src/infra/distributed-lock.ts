import crypto from "node:crypto";
import { redis } from "./redis.js";

function getLockKey(name: string) {
    return `lock:${name}`;
}

export async function acquireLock(name: string, ttlSeconds: number) {
    const key = getLockKey(name);
    const token = crypto.randomUUID();

    const result = await redis.set(key, token, {
        condition: "NX",
        expiration: {
            type: "EX",
            value: ttlSeconds,
        },
    });

    if (result !== "OK") {
        return null;
    }

    return {
        key,
        token,
    };
}

// Redis supports Lua scripts - atomically
const RELEASE_LOCK_SCRIPT = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
    end

    return 0
`;

export async function releaseLock(lock: { key: string; token: string }) {
    await redis.eval(RELEASE_LOCK_SCRIPT, {
        keys: [lock.key],
        arguments: [lock.token],
    });
}
