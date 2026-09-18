"use client";

import Link from "next/link";
import { CalendarDays, Crown, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Spaces } from "../api/spaces.api";

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

export function SpaceCard({ space, className }: { space: Spaces; className?: string }) {
    const isActive = space.spaceStatus === spaceStatus.ACTIVE;
    const isOwner = space.loggedInUserrole === "OWNER";
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
        <Link
            href={`/space/${space.spaceId}?spaceName=${space.spaceName}`}
            className={cn(
                "group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200",
                styles.card,
                "hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_color-mix(in_srgb,var(--primary)_55%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className,
            )}
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

            <div className="relative mt-5 flex items-center gap-2 border-t border-[color-mix(in_srgb,var(--primary)_12%,transparent)] pt-4 text-sm text-muted-foreground">
                <Music2 className="size-3.5 shrink-0 text-primary/70" aria-hidden />
                {/* {nowPlaying ? (
                    <span className="truncate">
                        {nowPlaying.title}
                        {nowPlaying.artist ? ` — ${nowPlaying.artist}` : ""}
                    </span>
                ) : (
                    <span className="truncate">Nothing playing</span>
                )} */}
            </div>
        </Link>
    );
}
