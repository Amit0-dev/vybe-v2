"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useSession } from "../hooks/useSession";
import { LogoutButton } from "./LogoutButton";
import { cn } from "@/lib/utils";

export function AuthNav() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />;
    }

    if (!session) {
        return (
            <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
                Sign in
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <Link href="/spaces" className={cn(buttonVariants({ size: "sm" }))}>
                Spaces
            </Link>

            <LogoutButton />
        </div>
    );
}
