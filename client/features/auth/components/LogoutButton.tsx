"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "../actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        setIsPending(true);

        const { error } = await signOut();

        if (error) {
            console.error("Logout failed:", error);
            setIsPending(false);
        }

        router.replace("/login");
        router.refresh();
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={"cursor-pointer"}
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending ? "Signing out..." : "Sign out"}
        </Button>
    );
}
