"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomTracks } from "../api/queue-api";

export const trackKeys = {
    custom: (params: { search?: string; page: number; limit: number }) =>
        ["tracks", "custom", params] as const,
};

export function useCustomTrack(search?: string, page: number = 1, limit: number = 20) {
    return useQuery({
        queryKey: trackKeys.custom({ search, page, limit }),
        queryFn: () => getCustomTracks(search, page, limit),
    });
}
