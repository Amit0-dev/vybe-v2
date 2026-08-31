export const RealtimeEvent = {
    QUEUE_ITEM_VOTE_UPDATED: "QUEUE_ITEM_VOTE_UPDATED",
} as const;

export type QueueItemVoteUpdatedEvent = {
    type: typeof RealtimeEvent.QUEUE_ITEM_VOTE_UPDATED;
    spaceId: string;
    queueItemId: string;
    score: number;
};
