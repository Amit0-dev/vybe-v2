"use client";

import { useMutation } from "@tanstack/react-query";
import { addYouTubeTrackToSpace } from "../api/queue-api";

export function useAddYoutubeTrack(spaceId: string) {
    return useMutation({
        mutationFn: (url: string) => addYouTubeTrackToSpace(spaceId, url),
    });
}
