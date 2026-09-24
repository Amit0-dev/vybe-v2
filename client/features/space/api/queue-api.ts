import { apiClient } from "@/lib/api-client";
import { AddYouTubeTrackResponse } from "../types/space.types";
import type { LibraryTrack } from "@/features/queue/types/queue.types";

export async function addYouTubeTrackToSpace(spaceId: string, url: string) {
    return apiClient<AddYouTubeTrackResponse>(`/api/spaces/${spaceId}/queue/youtube`, {
        method: "POST",
        body: JSON.stringify({ url }),
    });
}

export async function getCustomTracks(search?: string, page?: number, limit?: number) {
    const params = new URLSearchParams({
        page: String(page ?? 1),
        limit: String(limit ?? 20),
    });

    if (search?.trim()) {
        params.set("search", search.trim());
    }

    return apiClient<LibraryTrack>(`/api/tracks/custom?${params.toString()}`);
}