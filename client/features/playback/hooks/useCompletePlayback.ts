import { useMutation } from "@tanstack/react-query";
import { completePlayback } from "../api/playback.api";

export function useCompletePlayback(spaceId: string) {
    return useMutation({
        mutationFn: (queueItemId: string) => completePlayback(spaceId, queueItemId),
    });
}
