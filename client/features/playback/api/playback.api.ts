import { apiClient } from "@/lib/api-client";
import type {
    CompletePlaybackResponse,
    PlaybackUrlResponse,
    SkipPlaybackResponse,
    StartPlaybackResponse,
} from "../types/playback.types";

export function startPlayback(spaceId: string): Promise<StartPlaybackResponse> {
    return apiClient(`/api/spaces/${spaceId}/playback/start`, {
        method: "POST",
    });
}

export function completePlayback(
    spaceId: string,
    queueItemId: string,
): Promise<CompletePlaybackResponse> {
    return apiClient(`/api/spaces/${spaceId}/playback/${queueItemId}/complete`, {
        method: "POST",
    });
}

export function getPlaybackAudioUrl(
    spaceId: string,
    queueItemId: string,
): Promise<PlaybackUrlResponse> {
    return apiClient(`/api/spaces/${spaceId}/playback/${queueItemId}/audio`);
}

export function skipQueueItem(
    spaceId: string,
    queueItemId: string,
): Promise<SkipPlaybackResponse> {
    return apiClient(`/api/spaces/${spaceId}/queue/${queueItemId}/skip`, {
        method: "POST",
    });
}
