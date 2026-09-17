"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinSpace } from "../api/spaces.api";
import { spacesQueryKey } from "@/features/spaces/hooks/useSpaces";
import { JoinSpaceInput } from "../schemas/space.schema";

export function useJoinSpace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: JoinSpaceInput) => joinSpace(input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: spacesQueryKey,
            });
        },
    });
}
