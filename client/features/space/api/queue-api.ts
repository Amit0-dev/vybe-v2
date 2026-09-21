import { apiClient } from "@/lib/api-client";
import { AddYouTubeTrackResponse } from "../types/space.types";

export async function addYouTubeTrackToSpace(spaceId: string, url: string) {
    return apiClient<AddYouTubeTrackResponse>(`/api/spaces/${spaceId}/queue/youtube`, {
        method: "POST",
        body: JSON.stringify({ url }),
    });
}
