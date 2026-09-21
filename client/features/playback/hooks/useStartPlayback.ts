import { useMutation } from "@tanstack/react-query";
import { startPlayback } from "../api/playback.api";

export function useStartPlayback(spaceId: string) {
    return useMutation({
        mutationFn: () => startPlayback(spaceId),
    });
}
