"use client";

import { Music2, Pause, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiTrack } from "@/features/queue/types/queue.types";
import { cn } from "@/lib/utils";

interface FloatingNowPlayingProps {
  track?: ApiTrack | null;
  progressSec?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSkip?: () => void;
  className?: string;
}

/**
 * Compact host player that floats above the queue on small screens
 * so the queue can use the full viewport height.
 */
export function FloatingNowPlaying({
  track = null,
  progressSec = 0,
  isPlaying = false,
  onPlay,
  onPause,
  onSkip,
  className,
}: FloatingNowPlayingProps) {
  const duration = track?.durationSec ?? 0;
  const progress =
    duration > 0 ? Math.min(100, (progressSec / duration) * 100) : 0;

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
        aria-label="Host player"
      >
        {/* Thin progress strip */}
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
            <p className="truncate text-sm font-medium tracking-tight">
              {track?.title ?? "Nothing playing"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {track?.artist ?? "Host player"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 rounded-full"
              onClick={isPlaying ? onPause : onPlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current pl-0.5" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-full"
              onClick={onSkip}
              aria-label="Skip track"
            >
              <SkipForward className="size-4.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
