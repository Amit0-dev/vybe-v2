"use client";

import { Music2 } from "lucide-react";
import type { ApiTrack } from "@/features/queue/types/queue.types";
import { cn } from "@/lib/utils";
import { OwnerPresence } from "@/features/space/components/OwnerPresence";

interface FloatingNowPlayingPreviewProps {
  track?: ApiTrack | null;
  progressSec?: number;
  isPlaying?: boolean;
  isOwnerOnline?: boolean;
  ownerName?: string;
  className?: string;
}

/**
 * Compact member now-playing bar that floats on small screens
 * so the queue can use the full viewport height (no playback controls).
 */
export function FloatingNowPlayingPreview({
  track = null,
  progressSec = 0,
  isPlaying = false,
  isOwnerOnline = true,
  ownerName = "Host",
  className,
}: FloatingNowPlayingPreviewProps) {
  const duration = track?.durationSec ?? 0;
  const progress =
    duration > 0 ? Math.min(100, (progressSec / duration) * 100) : 0;

  const statusLabel = !track
    ? "Nothing playing"
    : !isOwnerOnline
      ? "Host offline"
      : isPlaying
        ? "Playing now"
        : "Paused";

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div
        className="pointer-events-auto mx-auto max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_12px_40px_-12px_rgba(28,96,86,0.35)] backdrop-blur-md"
        role="region"
        aria-label="Now playing preview"
      >
        <div className="h-0.5 w-full bg-muted" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
            <div className="flex size-full items-center justify-center">
                <Music2
                  className="size-4 text-muted-foreground/50"
                  aria-hidden
                />
              </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
              {statusLabel}
            </p>
            <p className="truncate text-sm font-medium tracking-tight">
              {track?.title ?? "Waiting for the host"}
            </p>
            {track?.artist && (
              <p className="truncate text-xs text-muted-foreground">
                {track.artist}
              </p>
            )}
          </div>

          <OwnerPresence
            isOnline={isOwnerOnline}
            ownerName={ownerName}
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
