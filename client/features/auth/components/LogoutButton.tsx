"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "../actions/auth";

export function LogoutButton() {
    const [isPending, setIsPending] = useState(false);

    async function handleLogout() {
        setIsPending(true);

        const { error } = await signOut();

        if (error) {
            console.error("Logout failed:", error);
            setIsPending(false);
        }
    }

    return (
        <Button type="button" variant="ghost" size="sm" className={"cursor-pointer"} onClick={handleLogout} disabled={isPending}>
            {isPending ? "Signing out..." : "Sign out"}
        </Button>
    );
}
