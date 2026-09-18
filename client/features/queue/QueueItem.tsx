"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Music2 } from "lucide-react";
import { VoteControls } from "@/features/voting/VoteControls";
import { formatDuration, cn } from "@/lib/utils";
import type { QueueItem as QueueItemType } from "../space/realtime/space-ws.types";

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
  const { track, score, id, status } = item;
  const isPlaying = status === "PLAYING";
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      layout={!reduceMotion}
      className={cn("list-none", className)}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 36 }
      }
    >
      <article
        className={cn(
          "group flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors sm:gap-4 sm:p-3.5",
          "border-border/70 shadow-[0_8px_20px_-16px_color-mix(in_srgb,#1c6056_40%,transparent)]",
          "hover:border-primary/25 hover:shadow-[0_12px_24px_-16px_color-mix(in_srgb,#1c6056_45%,transparent)]",
          isPlaying && "border-primary/35 bg-vybe-muted/60",
        )}
      >
        {typeof index === "number" && (
          <span
            className={cn(
              "hidden w-6 shrink-0 text-center text-xs font-medium tabular-nums sm:block",
              isPlaying ? "text-primary" : "text-muted-foreground/70",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-14">
          <div className="flex size-full items-center justify-center bg-linear-to-br from-primary/15 to-muted">
            <Music2 className="size-5 text-primary/60" aria-hidden />
          </div>
          {isPlaying && (
            <span className="absolute inset-x-0 bottom-0 bg-primary/90 py-0.5 text-center text-[9px] font-medium tracking-wider text-primary-foreground uppercase">
              Live
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight sm:text-[15px]">
            {track.title}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {track.artist && <span className="truncate">{track.artist}</span>}
            {typeof track.durationSec === "number" && (
              <span className="tabular-nums opacity-80">
                {formatDuration(track.durationSec)}
              </span>
            )}
          </div>
        </div>

        <VoteControls
          score={score}
          // userVote={userVote}
          onVote={(value) => onVote?.(id, value)}
          orientation="vertical"
          className="pl-1"
        />
      </article>
    </motion.li>
  );
}
