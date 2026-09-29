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
        spaceId: z.string(),
        id: z.string(),
        trackId: z.string(),
        score: z.number(),
        status: z.enum(QueueItemStatus),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
        track: z.object({
            id: z.string(),
            storageKey: z.string().nullable(),
            title: z.string(),
            artist: z.string().nullable(),
            durationSec: z.number(),
            source: z.enum(TrackSource),
            sourceId: z.string().nullable(),
            createdAt: z.coerce.date(),
            updatedAt: z.coerce.date(),
        }),
    }),
});

const ownerOfflineSchema = z.object({
    type: z.literal(RealtimeEvent.OWNER_OFFLINE),
    spaceId: z.string(),
});

const ownerOnlineSchema = z.object({
    type: z.literal(RealtimeEvent.OWNER_ONLINE),
    spaceId: z.string(),
});

const spaceClosedSchema = z.object({
    type: z.literal(RealtimeEvent.SPACE_CLOSED),
    spaceId: z.string(),
    reason: z.literal("OWNER_OFFLINE"),
});

export const realtimeEventSchema = z.discriminatedUnion("type", [
    queueItemVoteUpdatedSchema,
    queueItemPlayingSchema,
    queueItemSkippedSchema,
    queueItemCompletedSchema,
    queueItemAddedSchema,
    ownerOfflineSchema,
    ownerOnlineSchema,
    spaceClosedSchema,
]);
