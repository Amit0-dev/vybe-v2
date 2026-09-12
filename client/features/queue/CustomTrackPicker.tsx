"use client";

import { useMemo, useState } from "react";
import { Check, Music2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { LibraryTrack } from "@/lib/types";
import { formatDuration, cn } from "@/lib/utils";

interface CustomTrackPickerProps {
  tracks?: LibraryTrack[];
  selectedId?: string | null;
  onSelect?: (track: LibraryTrack) => void;
  isLoading?: boolean;
  className?: string;
}

export function CustomTrackPicker({
  tracks = [],
  selectedId = null,
  onSelect,
  isLoading = false,
  className,
}: CustomTrackPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.artist?.toLowerCase().includes(q) ?? false),
    );
  }, [tracks, query]);

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse rounded-lg bg-muted/70"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search your library..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 pl-9"
          aria-label="Search library tracks"
        />
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <Music2 className="size-8 text-muted-foreground/40" aria-hidden />
          <p className="font-heading mt-3 text-sm font-medium">
            No tracks in storage
          </p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Upload music to your library first, then pick it here for the queue.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          No tracks match &ldquo;{query.trim()}&rdquo;
        </div>
      ) : (
        <ul
          className="scrollbar-hide grid max-h-[min(58vh,480px)] gap-2.5 overflow-y-auto sm:grid-cols-2"
          role="listbox"
          aria-label="Library tracks"
        >
          {filtered.map((track) => {
            const selected = selectedId === track.id;
            return (
              <li key={track.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelect?.(track)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary/50 bg-vybe-muted shadow-[inset_0_0_0_1px_oklch(0.58_0.2_28_/_0.25)]"
                      : "border-border/70 bg-card/40 hover:border-primary/30 hover:bg-card",
                  )}
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {track.artworkUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.artworkUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Music2
                          className="size-4 text-muted-foreground/50"
                          aria-hidden
                        />
                      </div>
                    )}
                    {selected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium tracking-tight">
                      {track.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {track.artist && (
                        <span className="truncate">{track.artist}</span>
                      )}
                      {typeof track.durationSec === "number" && (
                        <span className="shrink-0 tabular-nums">
                          {formatDuration(track.durationSec)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
