"use client";

import { useState } from "react";
import { Library, Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomTrackPicker } from "@/features/queue/CustomTrackPicker";
import type { LibraryTrack } from "@/lib/types";
import { cn } from "@/lib/utils";

export type TrackSource = "youtube" | "custom";

export interface AddTrackPayload {
  source: TrackSource;
  url?: string;
  /** Selected library track id (custom source) */
  trackId?: string;
  title?: string;
  artist?: string;
}

interface AddTrackDialogProps {
  onAdd?: (payload: AddTrackPayload) => void;
  /** Tracks from your data storage — shown in the custom picker */
  libraryTracks?: LibraryTrack[];
  libraryLoading?: boolean;
  isLoading?: boolean;
  triggerClassName?: string;
}

type Step = "choose" | "youtube" | "custom";

export function AddTrackDialog({
  onAdd,
  libraryTracks = [],
  libraryLoading = false,
  isLoading = false,
  triggerClassName,
}: AddTrackDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<LibraryTrack | null>(null);

  function reset() {
    setStep("choose");
    setUrl("");
    setSelected(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function submitYoutube(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || isLoading) return;
    onAdd?.({ source: "youtube", url: trimmed });
    handleOpenChange(false);
  }

  function submitCustom() {
    if (!selected || isLoading) return;
    onAdd?.({
      source: "custom",
      trackId: selected.id,
      title: selected.title,
      artist: selected.artist,
    });
    handleOpenChange(false);
  }

  const isCustom = step === "custom";

  return (
    <>
      <Button
        type="button"
        size="sm"
        className={cn("gap-1.5 font-medium", triggerClassName)}
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" aria-hidden />
        Add Track
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            "gap-0 overflow-hidden p-0 sm:max-w-md",
            /* Wider panel for library browsing */
            isCustom && "sm:max-w-3xl",
          )}
        >
          {step === "choose" && (
            <div className="p-4 sm:p-5">
              <DialogHeader>
                <DialogTitle>Add a track</DialogTitle>
                <DialogDescription>
                  Choose how you want to bring music into this Space.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setStep("youtube")}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4 text-left transition-colors hover:border-primary/40 hover:bg-vybe-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Link2 className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="font-heading block text-sm font-medium">
                      YouTube URL
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      Paste a link and we&apos;ll pull the track into the queue.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("custom")}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4 text-left transition-colors hover:border-primary/40 hover:bg-vybe-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Library className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="font-heading block text-sm font-medium">
                      From your library
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      Pick a track already in your storage.
                    </span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === "youtube" && (
            <form onSubmit={submitYoutube} className="p-4 sm:p-5">
              <DialogHeader>
                <DialogTitle>YouTube URL</DialogTitle>
                <DialogDescription>
                  Paste a YouTube link to queue the track.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="yt-url" className="text-sm font-medium">
                  Link
                </label>
                <Input
                  id="yt-url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  className="h-10"
                  autoFocus
                />
              </div>

              <DialogFooter className="mx-0 mb-0 mt-6 border-0 bg-transparent p-0 sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("choose")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={!url.trim() || isLoading}>
                  {isLoading ? "Adding..." : "Add to queue"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {step === "custom" && (
            <div className="flex max-h-[min(90dvh,780px)] min-h-[min(70dvh,560px)] flex-col overflow-hidden">
              <div className="shrink-0 border-b border-border/60 px-4 pt-4 pb-3 sm:px-5 sm:pt-5">
                <DialogHeader>
                  <DialogTitle>Your library</DialogTitle>
                  <DialogDescription>
                    Select a track from storage to add to the queue.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-hide sm:px-6">
                <CustomTrackPicker
                  tracks={libraryTracks}
                  selectedId={selected?.id ?? null}
                  onSelect={setSelected}
                  isLoading={libraryLoading}
                />
              </div>

              {/* mx-0 mb-0 cancels DialogFooter defaults meant for padded dialogs */}
              <DialogFooter className="mx-0 mb-0 shrink-0 rounded-b-xl border-t border-border/60 bg-muted/30 px-4 py-3 sm:px-5 sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSelected(null);
                    setStep("choose");
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={!selected || isLoading}
                  onClick={submitCustom}
                >
                  {isLoading
                    ? "Adding..."
                    : selected
                      ? "Add to queue"
                      : "Select a track"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
