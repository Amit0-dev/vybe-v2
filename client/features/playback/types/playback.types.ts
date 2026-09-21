import type { ApiQueueItem } from "@/features/queue/types/queue.types";

/** Playing item is the same shape as a queue item (status PLAYING). */
export type ApiPlaybackState = ApiQueueItem;

export interface PlaybackUrlResponse {
    url: string;
}

export interface StartPlaybackResponse {
    queueItem: ApiPlaybackState | null;
}

export interface CompletePlaybackResponse {
    queueItem: {
        completedQueueItem: ApiPlaybackState | null;
        nextQueueItem: ApiPlaybackState | null;
    };
}

export interface SkipPlaybackResponse {
    queueItem: {
        skippedQueueItem: ApiPlaybackState | null;
        nextQueueItem: ApiPlaybackState | null;
    };
}
