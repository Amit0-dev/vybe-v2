import { apiClient } from "@/lib/api-client";
import type { ApiVoteResponse } from "../types/queue.types";

export async function voteOnQueueItem(spaceId: string, queueItemId: string, value: 1 | -1) {
    return apiClient<ApiVoteResponse>(`/api/spaces/${spaceId}/queue/${queueItemId}/vote`, {
        method: "POST",
        body: JSON.stringify({ value }),
    });
}
