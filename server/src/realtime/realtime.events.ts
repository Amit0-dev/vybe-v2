import { QueueItemStatus, TrackSource } from "../generated/prisma/enums.js";

export const RealtimeEvent = {
    QUEUE_ITEM_VOTE_UPDATED: "QUEUE_ITEM_VOTE_UPDATED",
    QUEUE_ITEM_ADDED: "QUEUE_ITEM_ADDED",
    QUEUE_ITEM_SKIPPED: "QUEUE_ITEM_SKIPPED",
    QUEUE_ITEM_COMPLETED: "QUEUE_ITEM_COMPLETED",
    QUEUE_ITEM_PLAYING: "QUEUE_ITEM_PLAYING",
    SPACE_SNAPSHOT: "SPACE_SNAPSHOT",
    SPACE_MEMBER_JOINED: "SPACE_MEMBER_JOINED",
    LIVE_USER_COUNT_UPDATED: "LIVE_USER_COUNT_UPDATED",

    OWNER_OFFLINE: "OWNER_OFFLINE",
    OWNER_ONLINE: "OWNER_ONLINE",
    SPACE_CLOSED: "SPACE_CLOSED",
} as const;

export type QueueItemVoteUpdatedEvent = {
    type: typeof RealtimeEvent.QUEUE_ITEM_VOTE_UPDATED;
    spaceId: string;
    queueItemId: string;
    score: number;
};

export type QueueItemPlayingEvent = {
    type: typeof RealtimeEvent.QUEUE_ITEM_PLAYING;
    spaceId: string;
    queueItemId: string;
};

export type QueueItemSkippedEvent = {
    type: typeof RealtimeEvent.QUEUE_ITEM_SKIPPED;
    spaceId: string;
    queueItemId: string;
};

export type QueueItemCompletedEvent = {
    type: typeof RealtimeEvent.QUEUE_ITEM_COMPLETED;
    spaceId: string;
    queueItemId: string;
};

export type QueueItemAddedEvent = {
    type: typeof RealtimeEvent.QUEUE_ITEM_ADDED;
    spaceId: string;
    queueItem: {
        spaceId: string;
        score: number;
        id: string;
        trackId: string;
        status: QueueItemStatus;
        createdAt: Date;
        updatedAt: Date;
        track: {
            id: string;
            storageKey: string | null;
            title: string;
            artist: string | null;
            durationSec: number;
            source: TrackSource;
            sourceId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    };
};

export type OwnerOfflineEvent = {
    type: typeof RealtimeEvent.OWNER_OFFLINE;
    spaceId: string;
};

export type OwnerOnlineEvent = {
    type: typeof RealtimeEvent.OWNER_ONLINE;
    spaceId: string;
};

export type SpaceClosedEvent = {
    type: typeof RealtimeEvent.SPACE_CLOSED;
    spaceId: string;
    reason: "OWNER_OFFLINE";
};

export type SpaceMemberJoinedEvent = {
    type: typeof RealtimeEvent.SPACE_MEMBER_JOINED;
    spaceId: string;
};

export type LiveUserCountUpdatedEvent = {
    type: typeof RealtimeEvent.LIVE_USER_COUNT_UPDATED;
    spaceId: string;
    liveUserCount: number;
};

export type RealTimeEventPayload =
    | QueueItemVoteUpdatedEvent
    | QueueItemPlayingEvent
    | QueueItemSkippedEvent
    | QueueItemCompletedEvent
    | QueueItemAddedEvent
    | OwnerOfflineEvent
    | OwnerOnlineEvent
    | SpaceClosedEvent
    | SpaceMemberJoinedEvent
    | LiveUserCountUpdatedEvent;
