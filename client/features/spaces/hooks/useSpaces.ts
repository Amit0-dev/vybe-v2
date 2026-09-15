"use client";

import { useQuery } from "@tanstack/react-query";
import { getSpaces } from "../api/spaces.api";

export const spacesQueryKey = ["spaces"] as const;

export function useSpaces() {
    return useQuery({
        queryKey: spacesQueryKey,
        queryFn: getSpaces,
    });
}