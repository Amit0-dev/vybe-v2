import { createClient } from "redis";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

function createRedisClient() {
    const client = createClient({
        url: env.REDIS_URL,
    });

    client.on("error", (error) => {
        logger.error(error, "Redis client error");
    });

    return client;
}

export const redis = createRedisClient();
export const redisPublisher = createRedisClient();
export const redisSubscriber = createRedisClient();
