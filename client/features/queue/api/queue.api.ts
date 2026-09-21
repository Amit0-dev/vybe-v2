import { apiClient } from "@/lib/api-client";

export type VoteQueueItemResponse = {
    changed: boolean;
    delta: number;
    vote: -1 | 0 | 1;
    score: number | null;
};

export async function voteOnQueueItem(spaceId: string, queueItemId: string, value: 1 | -1) {
    return apiClient<VoteQueueItemResponse>(`/api/spaces/${spaceId}/queue/${queueItemId}/vote`, {
        method: "POST",
        body: JSON.stringify({ value }),
    });
}
