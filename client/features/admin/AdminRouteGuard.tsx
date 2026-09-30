"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: user, isPending, error } = useCurrentUser();

    useEffect(() => {
        if (isPending) return;

        if (error instanceof ApiError && error.status === 401) {
            router.replace("/login");
            return;
        }

        if (!user || user.role !== "ADMIN") {
            router.replace("/spaces");
        }
    }, [error, isPending, router, user]);

    if (isPending || !user || user.role !== "ADMIN") {
        return (
            <div className="vybe-stage flex min-h-dvh items-center justify-center">
                <p className="text-sm text-muted-foreground">Checking admin access...</p>
            </div>
        );
    }

    return <>{children}</>;
}