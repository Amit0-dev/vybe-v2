"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMagicLink } from "../actions/auth";
import { MagicLinkFormValues, magicLinkSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export function MagicLinkForm() {
    const [isSent, setIsSent] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MagicLinkFormValues>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: MagicLinkFormValues) {
        setServerError(null);

        const result = await sendMagicLink(data.email);

        if (result.error) {
            setServerError(
                result.error.message || "An error occurred while sending the magic link.",
            );
            return;
        }

        setIsSent(true);
    }

    if (isSent) {
        return (
            <div className="space-y-2 text-center">
                <p className="font-medium">Check your email</p>
                <p className="text-sm text-muted-foreground">
                    We sent a sign-in link to your email address.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
                <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                    {...register("email")}
                />

                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Continue with email"}
            </Button>

            {serverError && (
                <p role="alert" className="text-sm text-destructive">
                    {serverError}
                </p>
            )}
        </form>
    );
}
