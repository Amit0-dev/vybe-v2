"use client";

import type { QueueItem as QueueItemType } from "@/lib/types";
import { QueueItem } from "./QueueItem";
import { cn } from "@/lib/utils";

interface QueueListProps {
  items?: QueueItemType[];
  onVote?: (queueItemId: string, value: 1 | -1) => void;
  className?: string;
}

export function QueueList({ items = [], onVote, className }: QueueListProps) {
  return (
    <section className={cn("flex h-full flex-col", className)} aria-label="Queue">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border/70 pb-3">
        <div>
          <h2 className="font-heading text-lg font-medium tracking-tight">
            Queue
          </h2>
          <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
            Vote to shape what plays next
          </p>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {items.length} {items.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 px-6 py-16 text-center">
          <p className="font-heading text-sm font-medium">Empty queue</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Use Add Track to bring the first song into the room.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col overflow-y-auto">
          {items.map((item, index) => (
            <QueueItem
              key={item.id}
              item={item}
              index={index}
              onVote={onVote}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
