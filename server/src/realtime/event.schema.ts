import { z } from "zod";
import { RealtimeEvent } from "./realtime.events.js";
import { QueueItemStatus, TrackSource } from "../generated/prisma/browser.js";

const queueItemVoteUpdatedSchema = z.object({
    type: z.literal(RealtimeEvent.QUEUE_ITEM_VOTE_UPDATED),
    spaceId: z.string(),
    queueItemId: z.string(),
    score: z.number(),
});

const queueItemPlayingSchema = z.object({
    type: z.literal(RealtimeEvent.QUEUE_ITEM_PLAYING),
    spaceId: z.string(),
    queueItemId: z.string(),
});

const queueItemSkippedSchema = z.object({
    type: z.literal(RealtimeEvent.QUEUE_ITEM_SKIPPED),
    spaceId: z.string(),
    queueItemId: z.string(),
});

const queueItemCompletedSchema = z.object({
    type: z.literal(RealtimeEvent.QUEUE_ITEM_COMPLETED),
    spaceId: z.string(),
    queueItemId: z.string(),
});

const queueItemAddedSchema = z.object({
    type: z.literal(RealtimeEvent.QUEUE_ITEM_ADDED),
    spaceId: z.string(),
    queueItem: z.object({
        id: z.string(),
        trackId: z.string(),
        score: z.number(),
        status: z.enum(QueueItemStatus),
        createdAt: z.date(),
        updatedAt: z.date(),
        track: z.object({
            id: z.string(),
            storageKey: z.string().nullable(),
            title: z.string(),
            artist: z.string().nullable(),
            durationSec: z.number(),
            source: z.enum(TrackSource),
            sourceId: z.string().nullable(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    }),
});

export const realtimeEventSchema = z.discriminatedUnion("type", [
    queueItemVoteUpdatedSchema,
    queueItemPlayingSchema,
    queueItemSkippedSchema,
    queueItemCompletedSchema,
    queueItemAddedSchema,
]);
