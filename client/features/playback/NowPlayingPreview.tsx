"use client";

import { Music2, PauseCircle } from "lucide-react";
import type { Track } from "@/lib/types";
import { formatDuration, cn } from "@/lib/utils";
import { OwnerPresence } from "@/features/space/components/OwnerPresence";

interface NowPlayingPreviewProps {
  track?: Track | null;
  progressSec?: number;
  isPlaying?: boolean;
  isOwnerOnline?: boolean;
  ownerName?: string;
  className?: string;
}

export function NowPlayingPreview({
  track = null,
  progressSec = 0,
  isPlaying = false,
  isOwnerOnline = true,
  ownerName = "Host",
  className,
}: NowPlayingPreviewProps) {
  const duration = track?.durationSec ?? 0;
  const progress =
    duration > 0 ? Math.min(100, (progressSec / duration) * 100) : 0;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card/50",
        className,
      )}
      aria-label="Now playing preview"
    >
      {!isOwnerOnline && (
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          <PauseCircle className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            Host is offline — playback is paused until they reconnect.
          </span>
        </div>
      )}

      <div className="flex items-center gap-4 p-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted sm:size-16">
          {track?.artworkUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.artworkUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Music2
                className="size-5 text-muted-foreground/50"
                aria-hidden
              />
            </div>
          )}
          {track && isPlaying && isOwnerOnline && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/80">
              <span
                className="block h-full bg-primary transition-[width] duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-[0.18em] text-primary uppercase">
            {track
              ? isPlaying && isOwnerOnline
                ? "Playing now"
                : "Paused"
              : "Nothing playing"}
          </p>
          {track ? (
            <>
              <h2 className="font-heading mt-1 truncate text-sm font-medium tracking-tight sm:text-base">
                {track.title}
              </h2>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                {track.artist && <span className="truncate">{track.artist}</span>}
                {duration > 0 && (
                  <span className="tabular-nums">
                    {formatDuration(progressSec)} / {formatDuration(duration)}
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              The host will start playback when tracks are ready.
            </p>
          )}
        </div>

        <OwnerPresence
          isOnline={isOwnerOnline}
          ownerName={ownerName}
          className="hidden shrink-0 sm:inline-flex"
        />
      </div>

      {/* Mobile presence row */}
      <div className="border-t border-border/50 px-4 py-2.5 sm:hidden">
        <OwnerPresence isOnline={isOwnerOnline} ownerName={ownerName} />
      </div>
    </section>
  );
}
