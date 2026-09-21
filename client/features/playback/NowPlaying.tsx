"use client";

import { Music2 } from "lucide-react";
import type { ApiTrack } from "@/features/queue/types/queue.types";
import { ProgressBar } from "./ProgressBar";
import { PlaybackPlayer } from "./PlaybackPlayer";
import { cn } from "@/lib/utils";

interface NowPlayingProps {
  track?: ApiTrack | null;
  progressSec?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSkip?: () => void;
  className?: string;
}

/** Full host player — only rendered for the Space owner. */
export function NowPlaying({
  track = null,
  progressSec = 0,
  isPlaying = false,
  onPlay,
  onPause,
  onSkip,
  className,
}: NowPlayingProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card",
        className,
      )}
      aria-label="Now playing"
    >
      <div
        className="absolute top-0 right-0 h-16 w-1 bg-primary"
        aria-hidden
      />

      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <p className="text-[11px] font-medium tracking-[0.22em] text-primary uppercase">
          Now Playing
        </p>
        <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-primary uppercase">
          Host player
        </span>
      </div>

      <div className="flex flex-col items-center px-5 py-5 sm:px-6 sm:py-6">
        {!track ? (
          <>
            <div className="flex size-28 items-center justify-center rounded-lg border border-dashed border-border bg-background/50 sm:size-32">
              <Music2
                className="size-8 text-muted-foreground/35"
                aria-hidden
              />
            </div>
            <h2 className="font-heading mt-4 text-base font-medium tracking-tight sm:text-lg">
              Ready when you are
            </h2>
            <p className="mt-1.5 max-w-[240px] text-center text-sm leading-relaxed text-muted-foreground">
              Audio plays on your browser. Start a track when the queue looks
              good.
            </p>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border border-border/50 shadow-[0_20px_40px_-20px_oklch(0.58_0.2_28_/_0.45)]">
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 via-card to-muted">
                  <Music2 className="size-10 text-primary/70" aria-hidden />
                </div>
            </div>

            <h2 className="font-heading mt-4 w-full text-center text-lg font-medium tracking-tight text-balance sm:text-xl">
              {track.title}
            </h2>
            {track.artist && (
              <p className="mt-1 text-sm text-muted-foreground">
                {track.artist}
              </p>
            )}

            <ProgressBar
              currentSec={progressSec}
              durationSec={track.durationSec ?? 0}
              className="mt-5 w-full"
            />

            <div className="mt-4">
              <PlaybackPlayer
                isOwner
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
                onSkip={onSkip}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
