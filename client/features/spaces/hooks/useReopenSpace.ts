"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reopenSpace } from "../api/spaces.api";
import { spacesQueryKey } from "./useSpaces";

export function useReopenSpace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (spaceId: string) => reopenSpace(spaceId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: spacesQueryKey,
            });
        },
    });
}