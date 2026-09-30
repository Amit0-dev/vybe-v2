"use client";

import { useMutation } from "@tanstack/react-query";
import { addTrackToSpace } from "../api/queue-api";

export function useAddCustomTrack(spaceId: string) {
    return useMutation({
        mutationFn: (trackId: string) => addTrackToSpace(spaceId, trackId),
    });
}