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
