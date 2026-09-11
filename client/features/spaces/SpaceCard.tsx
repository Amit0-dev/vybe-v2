"use client";

import Link from "next/link";
import { Crown, Music2, Users } from "lucide-react";
import type { SpaceSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpaceCardProps extends SpaceSummary {
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
  className,
  onClick,
}: SpaceCardProps) {
  const isActive = status === "ACTIVE";

  return (
    <Link
      href={`/space/${id}`}
      onClick={onClick}
      className={cn(
        "group flex min-h-[168px] flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading truncate text-base font-semibold tracking-tight">
            {name}
          </h3>
          {isOwner && (
            <Crown
              className="size-3.5 shrink-0 text-primary"
              aria-label="You host this space"
            />
          )}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
              isActive
                ? "bg-emerald-500/12 text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isActive ? "bg-emerald-400" : "bg-muted-foreground",
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

      <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-sm text-muted-foreground">
        <Music2 className="size-3.5 shrink-0 text-primary/80" aria-hidden />
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
