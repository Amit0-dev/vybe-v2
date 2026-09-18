"use client";

import { useQuery } from "@tanstack/react-query";
import { getSpace } from "../api/space.api";

export const spaceQueryKey = (spaceId: string) => ["space", spaceId] as const;

export function useSpace(spaceId: string) {
    return useQuery({
        queryKey: spaceQueryKey(spaceId),
        queryFn: () => getSpace(spaceId),
        enabled: Boolean(spaceId),
    });
}
