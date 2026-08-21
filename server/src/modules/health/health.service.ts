import prisma from "../../infra/db.js";
import { redis } from "../../infra/redis.js";

export async function checkReadiness() {
    const checks = {
        database: false,
        redis: false,
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.database = true;
    } catch (error) {
        checks.database = false;
    }

    try {
        await redis.ping();
        checks.redis = true;
    } catch (error) {
        checks.redis = false;
    }

    return {
        ready: checks.database && checks.redis,
        checks,
    };
}
