export const RealtimeEvent = {
    QUEUE_ITEM_VOTE_UPDATED: "QUEUE_ITEM_VOTE_UPDATED",
    QUEUE_ITEM_ADDED: "QUEUE_ITEM_ADDED",
    QUEUE_ITEM_SKIPPED: "QUEUE_ITEM_SKIPPED",
    QUEUE_ITEM_PLAYING: "QUEUE_ITEM_PLAYING",
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
