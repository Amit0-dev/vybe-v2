"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteControlsProps {
  score?: number;
  userVote?: 1 | -1 | null;
  onVote?: (value: 1 | -1) => void;
  className?: string;
}

export function VoteControls({
  score = 0,
  userVote = null,
  onVote,
  className,
}: VoteControlsProps) {
  return (
    <div
      className={cn("flex shrink-0 flex-col items-center gap-0.5", className)}
    >
      <button
        type="button"
        onClick={() => onVote?.(1)}
        aria-label="Upvote"
        aria-pressed={userVote === 1}
        className={cn(
          "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          userVote === 1 && "bg-vybe-muted text-primary",
        )}
      >
        <ChevronUp
          className={cn("size-4", userVote === 1 && "stroke-[2.5]")}
        />
      </button>
      <span
        className={cn(
          "min-w-[1.25rem] text-center text-xs font-medium tabular-nums",
          userVote === 1 && "text-primary",
          userVote === -1 && "text-destructive",
        )}
      >
        {score}
      </span>
      <button
        type="button"
        onClick={() => onVote?.(-1)}
        aria-label="Downvote"
        aria-pressed={userVote === -1}
        className={cn(
          "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          userVote === -1 && "bg-destructive/15 text-destructive",
        )}
      >
        <ChevronDown
          className={cn("size-4", userVote === -1 && "stroke-[2.5]")}
        />
      </button>
    </div>
  );
}
