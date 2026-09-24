import prisma from "./db.js";
import { redis, redisPublisher, redisSubscriber } from "./redis.js";

export async function connectInfra() {
    await prisma.$connect();

    await redis.connect();
    await redisPublisher.connect();
    await redisSubscriber.connect();
}

export async function disconnectInfra() {
    await redisSubscriber.quit();
    await redisPublisher.quit();
    await redis.quit();

    await prisma.$disconnect();
}

export async function connectWorkerInfra() {
    await prisma.$connect();
    await redis.connect();
}

export async function disconnectWorkerInfra() {
    await redis.quit();
    await prisma.$disconnect();
}