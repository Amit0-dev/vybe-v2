import type { QueueItemStatus } from "@/features/space/realtime/space-ws.types";
import type { ApiTrack } from "@/features/queue/types/queue.types";

export interface ApiPlaybackState {
    id: string;
    spaceId: string;
    trackId: string;
    status: QueueItemStatus;
    score: number;
    createdAt: string;
    updatedAt: string;
    track: ApiTrack;
}

export interface PlaybackUrlResponse {
    url: string;
}

export interface StartPlaybackResponse {
    queueItem: ApiPlaybackState | null;
}

export interface CompletePlaybackResponse {
    completedQueueItem: ApiPlaybackState | null;
    nextQueueItem: ApiPlaybackState | null;
}

export interface SkipPlaybackResponse {
    skippedQueueItem: ApiPlaybackState | null;
    nextQueueItem: ApiPlaybackState | null;
}
