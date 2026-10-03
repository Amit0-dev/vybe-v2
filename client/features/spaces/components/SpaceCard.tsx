"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Check, Copy, Crown, Music2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useReopenSpace } from "../hooks/useReopenSpace";
import type { ApiSpaceListItem } from "../types/spaces.types";

/** Theme-matched accents only — cream + teal family, no loud random hues. */
export const SPACE_CARD_ACCENTS = ["sage", "moss", "mist"] as const;
export type SpaceCardAccent = (typeof SPACE_CARD_ACCENTS)[number];

const ACCENT_STYLES: Record<
    SpaceCardAccent,
    { card: string; wash: string; chip: string; icon: string }
> = {
    /* Primary teal wash — closest to brand (adapts via --primary / --background) */
    sage: {
        card: "border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_9%,var(--background))]",
        wash: "from-[color-mix(in_srgb,var(--primary)_18%,transparent)]",
        chip: "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-primary",
        icon: "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-primary",
    },
    /* Deeper forest mix of the same green family */
    moss: {
        card: "border-[color-mix(in_srgb,var(--primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--primary)_14%,var(--background))]",
        wash: "from-[color-mix(in_srgb,var(--primary)_22%,transparent)]",
        chip: "bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-primary",
        icon: "bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-primary",
    },
    /* Soft mist — barely-there teal */
    mist: {
        card: "border-[color-mix(in_srgb,var(--primary)_14%,transparent)] bg-[color-mix(in_srgb,var(--primary)_4%,var(--background))]",
        wash: "from-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
        chip: "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary",
        icon: "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary",
    },
};

/** Stable accent from space id — same card keeps the same color after wire-up. */
export function getSpaceCardAccent(spaceId: string): SpaceCardAccent {
    let hash = 0;
    for (let i = 0; i < spaceId.length; i++) {
        hash = (hash + spaceId.charCodeAt(i) * (i + 1)) % 2147483647;
    }
    return SPACE_CARD_ACCENTS[Math.abs(hash) % SPACE_CARD_ACCENTS.length];
}

const spaceStatus = {
    ACTIVE: "ACTIVE",
    CLOSED: "CLOSED",
} as const;

export function SpaceCard({ space, className }: { space: ApiSpaceListItem; className?: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const isActive = space.spaceStatus === spaceStatus.ACTIVE;
    const isOwner = space.loggedInUserrole === "OWNER";
    const canReopen = !isActive && isOwner;
    const reopenMutation = useReopenSpace();
    const tone = getSpaceCardAccent(space.spaceId);
    const styles = ACCENT_STYLES[tone];
    const ownerLabel = space.owner.name?.trim() || space.owner.email;
    const joinedAt = new Date(space.membershipJoinedAt);
    const joinedAtLabel = Number.isNaN(joinedAt.getTime())
        ? null
        : new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
          }).format(joinedAt);

    return (
        <div
            className={cn(
                "group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border transition-all duration-200",
                styles.card,
                "hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_color-mix(in_srgb,var(--primary)_55%,transparent)]",
                className,
            )}
        >
            <Link
                href={`/space/${space.spaceId}?spaceName=${space.spaceName}`}
                className="relative flex flex-1 flex-col justify-between p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
            {/* Soft top wash */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b to-transparent",
                    styles.wash,
                )}
                aria-hidden
            />

            <div className="relative min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-heading truncate text-base font-semibold tracking-tight text-foreground">
                                {space.spaceName}
                            </h3>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
                                    isActive ? styles.chip : "bg-muted text-muted-foreground",
                                )}
                            >
                                <span
                                    className={cn(
                                        "size-1.5 rounded-full",
                                        isActive ? "bg-primary" : "bg-muted-foreground",
                                    )}
                                    aria-hidden
                                />
                                {isActive ? "Active" : "Inactive"}
                            </span>
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
                                    styles.chip,
                                )}
                            >
                                {isOwner ? (
                                    <Crown className="size-3" aria-hidden />
                                ) : (
                                    <Music2 className="size-3" aria-hidden />
                                )}
                                {isOwner ? "Owner" : "Participant"}
                            </span>
                        </div>
                        <p className="mt-2 flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground">
                            {isOwner ? (
                                <Crown className="size-3 shrink-0 text-primary/70" aria-hidden />
                            ) : (
                                <CalendarDays className="size-3 shrink-0 text-primary/70" aria-hidden />
                            )}
                            <span className="truncate">
                                {isOwner
                                    ? ownerLabel
                                    : joinedAtLabel && `Joined ${joinedAtLabel}`}
                            </span>
                        </p>
                    </div>

                    <span
                        className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                            styles.icon,
                        )}
                        aria-hidden
                    >
                        <Music2 className="size-4" />
                    </span>
                </div>
            </div>

            </Link>

            <div className="relative flex items-center justify-between gap-3 border-t border-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-5 py-3.5">
                <div className="min-w-0">
                    <p className="text-[0.68rem] font-medium uppercase tracking-wider text-muted-foreground">
                        Space code
                    </p>
                    <p className="mt-0.5 truncate font-mono text-sm font-semibold tracking-[0.12em] text-foreground">
                        {space.spaceJoinCode}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={isCopied ? "Space code copied" : "Copy space code"}
                    title={isCopied ? "Copied" : "Copy space code"}
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(space.spaceJoinCode);
                            setIsCopied(true);
                            window.setTimeout(() => setIsCopied(false), 1500);
                        } catch {
                            toast.error("Unable to copy the space code.");
                        }
                    }}
                >
                    {isCopied ? <Check aria-hidden /> : <Copy aria-hidden />}
                </Button>
            </div>

            {canReopen && (
                <div className="relative border-t border-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-5 py-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => reopenMutation.mutate(space.spaceId)}
                        disabled={reopenMutation.isPending}
                    >
                        <RotateCcw
                            className={reopenMutation.isPending ? "animate-spin" : undefined}
                            aria-hidden
                        />
                        {reopenMutation.isPending ? "Reopening..." : "Reopen space"}
                    </Button>
                    {reopenMutation.isError && (
                        <p className="mt-2 text-xs text-destructive" role="alert">
                            {reopenMutation.error.message}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
