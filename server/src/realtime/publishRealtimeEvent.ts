import { redisPublisher } from "../infra/redis.js";
import type { RealTimeEventPayload } from "./realtime.events.js";

const REALTIME_CHANNEL = "vybe:realtime";

export async function publishRealtimeEvent(event: RealTimeEventPayload) {
    await redisPublisher.publish(REALTIME_CHANNEL, JSON.stringify(event));
}
