"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteControlsProps {
  score?: number;
  userVote?: 1 | -1 | null;
  onVote?: (value: 1 | -1) => void;
  className?: string;
  /** Horizontal layout for compact cards */
  orientation?: "vertical" | "horizontal";
  isVoting?: boolean
}

export function VoteControls({
  score = 0,
  userVote = null,
  onVote,
  className,
  orientation = "vertical",
  isVoting
}: VoteControlsProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center",
        isHorizontal ? "flex-row gap-0.5" : "flex-col gap-0.5",
        className,
      )}
    >
      <button
        type="button"
        disabled={isVoting}
        onClick={() => onVote?.(1)}
        aria-label="Upvote"
        aria-pressed={userVote === 1}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
          "hover:bg-primary/10 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          userVote === 1 && "bg-primary/15 text-primary",
        )}
      >
        <ArrowBigUp
          className={cn(
            "size-5",
            userVote === 1 && "fill-current stroke-[1.5]",
          )}
          aria-hidden
        />
      </button>

      <span
        className={cn(
          "min-w-[1.75rem] text-center text-sm font-semibold tabular-nums",
          userVote === 1 && "text-primary",
          userVote === -1 && "text-destructive",
        )}
      >
        {score}
      </span>

      <button
        type="button"
        disabled={isVoting}
        onClick={() => onVote?.(-1)}
        aria-label="Downvote"
        aria-pressed={userVote === -1}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
          "hover:bg-destructive/10 hover:text-destructive",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          userVote === -1 && "bg-destructive/15 text-destructive",
        )}
      >
        <ArrowBigDown
          className={cn(
            "size-5",
            userVote === -1 && "fill-current stroke-[1.5]",
          )}
          aria-hidden
        />
      </button>
    </div>
  );
}
