"use client";

import { formatDuration, cn } from "@/lib/utils";

interface ProgressBarProps {
  currentSec?: number;
  durationSec?: number;
  className?: string;
}

export function ProgressBar({
  currentSec = 0,
  durationSec = 0,
  className,
}: ProgressBarProps) {
  const progress =
    durationSec > 0 ? Math.min(100, (currentSec / durationSec) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.floor(currentSec)}
        aria-valuemin={0}
        aria-valuemax={Math.floor(durationSec)}
        aria-label="Playback progress"
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{formatDuration(currentSec)}</span>
        <span>{formatDuration(durationSec)}</span>
      </div>
    </div>
  );
}
