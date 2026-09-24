import { logger } from "../infra/logger.js";
import { redisSubscriber } from "../infra/redis.js";
import { realtimeEventSchema } from "./event.schema.js";
import { broadcastToSpace } from "./realtime.manager.js";

const REALTIME_CHANNEL = "vybe:realtime";

export async function subscribeToRealtimeEvents() {
    await redisSubscriber.subscribe(REALTIME_CHANNEL, (message: string) => {
        let rawEvent: unknown;

        try {
            rawEvent = JSON.parse(message);
        } catch (error) {
            logger.error({ error, message }, "Invalid JSON received from Redis");
            return;
        }

        const parsed = realtimeEventSchema.safeParse(rawEvent);

        if (!parsed.success) {
            logger.error(
                {
                    error: parsed.error,
                    message,
                },
                "Invalid realtime event received from Redis",
            );

            return;
        }

        broadcastToSpace(parsed.data.spaceId, parsed.data);
    });
}
