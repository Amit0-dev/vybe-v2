"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaybackPlayerProps {
  isOwner?: boolean;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSkip?: () => void;
}

export function PlaybackPlayer({
  isOwner = false,
  isPlaying = false,
  onPlay,
  onPause,
  onSkip,
}: PlaybackPlayerProps) {
  if (!isOwner) return null;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-12 rounded-full border-border bg-card hover:bg-accent"
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
        className="size-10 rounded-full"
        onClick={onSkip}
        aria-label="Skip track"
      >
        <SkipForward className="size-5" />
      </Button>
    </div>
  );
}
