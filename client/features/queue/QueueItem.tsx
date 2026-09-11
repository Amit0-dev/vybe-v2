"use client";

import { Music2 } from "lucide-react";
import type { QueueItem as QueueItemType } from "@/lib/types";
import { VoteControls } from "@/features/voting/VoteControls";
import { cn } from "@/lib/utils";

interface QueueItemProps {
  item: QueueItemType;
  index?: number;
  onVote?: (queueItemId: string, value: 1 | -1) => void;
  className?: string;
}

export function QueueItem({
  item,
  index,
  onVote,
  className,
}: QueueItemProps) {
  const { track, score, userVote, id } = item;

  return (
    <li
      className={cn(
        "group flex items-center gap-3 border-b border-border/50 px-1 py-3 last:border-b-0 transition-colors hover:bg-card/60",
        className,
      )}
    >
      {typeof index === "number" && (
        <span className="w-6 shrink-0 text-center text-xs tabular-nums text-muted-foreground/70">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
        {track.artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.artworkUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Music2 className="size-4 text-muted-foreground/50" aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tracking-tight">
          {track.title}
        </p>
        {track.artist && (
          <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
        )}
      </div>

      <VoteControls
        score={score}
        userVote={userVote}
        onVote={(value) => onVote?.(id, value)}
      />
    </li>
  );
}
