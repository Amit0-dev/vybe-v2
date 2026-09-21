import { useMutation } from "@tanstack/react-query";
import { skipQueueItem } from "../api/playback.api";

export function useSkipQueueItem(spaceId: string) {
    return useMutation({
        mutationFn: (queueItemId: string) => skipQueueItem(spaceId, queueItemId),
    });
}
