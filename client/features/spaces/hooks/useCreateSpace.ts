"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpace } from "../api/spaces.api";
import { spacesQueryKey } from "./useSpaces";
import type { CreateSpaceInput } from "../schemas/space.schema";

export function useCreateSpace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateSpaceInput) => createSpace(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: spacesQueryKey,
            });
        },
    });
}
