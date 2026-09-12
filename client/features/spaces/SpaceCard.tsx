"use client";

import Link from "next/link";
import { Crown, Music2, Users } from "lucide-react";
import type { SpaceSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Theme-matched accents only — cream + teal family, no loud random hues. */
export const SPACE_CARD_ACCENTS = ["sage", "moss", "mist"] as const;
export type SpaceCardAccent = (typeof SPACE_CARD_ACCENTS)[number];

const ACCENT_STYLES: Record<
  SpaceCardAccent,
  { card: string; wash: string; chip: string; icon: string }
> = {
  /* Primary teal wash — closest to brand */
  sage: {
    card: "border-[color-mix(in_srgb,#1c6056_20%,transparent)] bg-[color-mix(in_srgb,#1c6056_9%,#ffffeb)]",
    wash: "from-[color-mix(in_srgb,#1c6056_18%,transparent)]",
    chip: "bg-[color-mix(in_srgb,#1c6056_14%,transparent)] text-[#1c6056]",
    icon: "bg-[color-mix(in_srgb,#1c6056_14%,transparent)] text-[#1c6056]",
  },
  /* Deeper forest mix of the same green */
  moss: {
    card: "border-[color-mix(in_srgb,#143f39_22%,transparent)] bg-[color-mix(in_srgb,#143f39_11%,#ffffeb)]",
    wash: "from-[color-mix(in_srgb,#143f39_20%,transparent)]",
    chip: "bg-[color-mix(in_srgb,#143f39_14%,transparent)] text-[#143f39]",
    icon: "bg-[color-mix(in_srgb,#143f39_14%,transparent)] text-[#143f39]",
  },
  /* Soft mist — barely-there teal on cream */
  mist: {
    card: "border-[color-mix(in_srgb,#1c6056_14%,transparent)] bg-[color-mix(in_srgb,#1c6056_4%,#ffffeb)]",
    wash: "from-[color-mix(in_srgb,#1c6056_10%,transparent)]",
    chip: "bg-[color-mix(in_srgb,#1c6056_10%,transparent)] text-[#1c6056]",
    icon: "bg-[color-mix(in_srgb,#1c6056_10%,transparent)] text-[#1c6056]",
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

interface SpaceCardProps extends SpaceSummary {
  /** Force an accent; otherwise derived from `id` */
  accent?: SpaceCardAccent;
  className?: string;
  onClick?: () => void;
}

export function SpaceCard({
  id,
  name,
  status,
  memberCount,
  nowPlaying,
  isOwner,
  accent,
  className,
  onClick,
}: SpaceCardProps) {
  const isActive = status === "ACTIVE";
  const tone = accent ?? getSpaceCardAccent(id);
  const styles = ACCENT_STYLES[tone];

  return (
    <Link
      href={`/space/${id}`}
      onClick={onClick}
      className={cn(
        "group relative flex min-h-[176px] flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200",
        styles.card,
        "hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_color-mix(in_srgb,#1c6056_55%,transparent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Soft top wash */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
          styles.wash,
        )}
        aria-hidden
      />

      <div className="relative min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading truncate text-base font-semibold tracking-tight text-foreground">
                {name}
              </h3>
              {isOwner && (
                <Crown
                  className="size-3.5 shrink-0 text-primary"
                  aria-label="You host this space"
                />
              )}
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
              {typeof memberCount === "number" && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3" aria-hidden />
                  {memberCount}
                </span>
              )}
            </div>
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

      <div className="relative mt-5 flex items-center gap-2 border-t border-[color-mix(in_srgb,#1c6056_12%,transparent)] pt-4 text-sm text-muted-foreground">
        <Music2 className="size-3.5 shrink-0 text-primary/70" aria-hidden />
        {nowPlaying ? (
          <span className="truncate">
            {nowPlaying.title}
            {nowPlaying.artist ? ` — ${nowPlaying.artist}` : ""}
          </span>
        ) : (
          <span className="truncate">Nothing playing</span>
        )}
      </div>
    </Link>
  );
}
