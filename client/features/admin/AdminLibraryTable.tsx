"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Music2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDuration, cn } from "@/lib/utils";

export interface AdminLibraryTrack {
  id: string;
  title: string;
  artist?: string;
  durationSec?: number;
  uploadedAt?: string;
}

interface AdminLibraryTableProps {
  tracks?: AdminLibraryTrack[];
  className?: string;
  listClassName?: string;
  emptyHint?: string;
}

/** Placeholder library list with search — wire CRUD later */
export function AdminLibraryTable({
  tracks = [],
  className,
  listClassName,
  emptyHint = "No tracks yet. Upload the first one to get started.",
}: AdminLibraryTableProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter((track) => {
      const haystack = `${track.title} ${track.artist ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [tracks, deferredQuery]);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60",
        className,
      )}
      aria-label="Library tracks"
    >
      <div className="shrink-0 space-y-3 border-b border-border/60 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Uploaded music
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {tracks.length} track{tracks.length === 1 ? "" : "s"} in the shared
              library
            </p>
          </div>
          {query.trim() && (
            <p className="text-xs text-muted-foreground tabular-nums">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or artist…"
            className="h-11 pl-9"
            aria-label="Search uploaded music"
          />
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground sm:px-5">
          {emptyHint}
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground sm:px-5">
          No tracks match “{query.trim()}”.
        </div>
      ) : (
        <ul
          className={cn(
            "scrollbar-hide divide-y divide-border/50 overflow-y-auto overscroll-y-contain",
            "max-h-[min(52dvh,420px)] sm:max-h-[min(58dvh,520px)]",
            listClassName,
          )}
        >
          {filtered.map((track) => (
            <li
              key={track.id}
              className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3 sm:px-5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Music2 className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{track.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {track.artist ?? "Unknown artist"}
                    {typeof track.durationSec === "number" && (
                      <>
                        {" · "}
                        <span className="tabular-nums">
                          {formatDuration(track.durationSec)}
                        </span>
                      </>
                    )}
                    {track.uploadedAt && (
                      <span className="sm:hidden">
                        {" · "}
                        {track.uploadedAt}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                {track.uploadedAt && (
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {track.uploadedAt}
                  </span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 shrink-0 px-3 sm:min-h-9"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
