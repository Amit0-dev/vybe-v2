"use client";

import { Music2 } from "lucide-react";
import type { Track } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { PlaybackPlayer } from "./PlaybackPlayer";
import { cn } from "@/lib/utils";

interface NowPlayingProps {
  track?: Track | null;
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
        "relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card",
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

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {!track ? (
          <>
            <div className="flex size-40 items-center justify-center rounded-lg border border-dashed border-border bg-background/50 sm:size-48">
              <Music2
                className="size-10 text-muted-foreground/35"
                aria-hidden
              />
            </div>
            <h2 className="font-heading mt-6 text-lg font-medium tracking-tight">
              Ready when you are
            </h2>
            <p className="mt-2 max-w-[240px] text-center text-sm leading-relaxed text-muted-foreground">
              Audio plays on your browser. Start a track when the queue looks
              good.
            </p>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-lg border border-border/50 shadow-[0_20px_40px_-20px_oklch(0.58_0.2_28_/_0.45)]">
              {track.artworkUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.artworkUrl}
                  alt={`Artwork for ${track.title}`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 via-card to-muted">
                  <Music2 className="size-12 text-primary/70" aria-hidden />
                </div>
              )}
            </div>

            <h2 className="font-heading mt-6 w-full text-center text-xl font-medium tracking-tight text-balance">
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
              className="mt-6 w-full"
            />

            <div className="mt-5">
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
