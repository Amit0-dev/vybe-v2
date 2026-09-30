"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type CurrentUser = {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: "USER" | "ADMIN";
};

async function getCurrentUser() {
    const response = await apiClient<{ user: CurrentUser }>("/api/user/me");
    return response.user;
}

export function useCurrentUser(enabled = true) {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        enabled,
        retry: false,
    });
}