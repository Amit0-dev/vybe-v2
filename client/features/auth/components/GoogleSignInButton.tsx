"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "../actions/auth";

export function GoogleSignInButton() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSignIn() {
        setError(null);
        setIsPending(true);

        const result = await signInWithGoogle();

        if (result.error) {
            setError(result.error.message || "An error occurred while signing in with Google.");
            setIsPending(false);
        }
    }

    return (
        <div className="space-y-2">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSignIn}
                disabled={isPending}
            >
                {isPending ? "Connecting..." : "Continue with Google"}
            </Button>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
