"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { QueueItem as QueueItemType } from "@/lib/types";
import { QueueItem } from "./QueueItem";
import { cn } from "@/lib/utils";

interface QueueListProps {
  items?: QueueItemType[];
  onVote?: (queueItemId: string, value: 1 | -1) => void;
  className?: string;
}

export function QueueList({ items = [], onVote, className }: QueueListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function onScroll() {
      setShowTop((el?.scrollTop ?? 0) > 80);
    }

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden",
        className,
      )}
    >
      <div className="mb-4 flex shrink-0 items-baseline justify-between gap-3 px-0.5">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Queue
          </h2>
          <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
            Vote to shape what plays next
          </p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {items.length} {items.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 px-6 py-16 text-center">
          <p className="font-heading text-sm font-medium">Empty queue</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Use Add Track to bring the first song into the room.
          </p>
        </div>
      ) : (
        <>
          {/*
            h-0 + flex-1 is the reliable flex scroll pattern:
            forces a bounded height so overflow-y can activate.
          */}
          <div
            ref={scrollRef}
            data-queue-scroll
            className="scrollbar-hide h-0 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex flex-col gap-2.5 pb-12" aria-label="Queue">
              {items.map((item, index) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  index={index}
                  onVote={onVote}
                />
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll queue to top"
            className={cn(
              "absolute right-1/2 translate-x-1/2 bottom-8 z-10 flex size-9 items-center justify-center rounded-full border border-border/80 bg-card/95 text-foreground shadow-md backdrop-blur-sm transition-all",
              "hover:border-primary/40 hover:bg-vybe-muted hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              showTop
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0",
            )}
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </>
      )}
    </div>
  );
}
