"use client";

import { useMutation } from "@tanstack/react-query";
import { voteOnQueueItem } from "../api/queue.api";

export function useVoteQueueItem(spaceId: string) {
    return useMutation({
        mutationFn: ({ queueItemId, value }: { queueItemId: string; value: 1 | -1 }) =>
            voteOnQueueItem(spaceId, queueItemId, value),
    });
}
