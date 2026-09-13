"use client";

import { Music2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminLibraryUploadProps {
  className?: string;
  /** Called after a UI-only submit (e.g. close mobile sheet) */
  onSubmitted?: () => void;
  /** Prefix form control ids when multiple instances can mount */
  idPrefix?: string;
}

/** UI-only upload panel for desktop library layout */
export function AdminLibraryUpload({
  className,
  onSubmitted,
  idPrefix = "track",
}: AdminLibraryUploadProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-6",
        className,
      )}
      aria-label="Upload music"
    >
      <div className="min-w-0">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Upload track
        </h2>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
          Add a track to Vybe’s shared library. Members can pick it when
          queuing music in a Space.
        </p>
      </div>

      <AdminLibraryUploadFields
        className="mt-5"
        titleId={`${idPrefix}-title`}
        artistId={`${idPrefix}-artist`}
        onSubmitted={onSubmitted}
      />
    </section>
  );
}

interface AdminLibraryUploadFieldsProps {
  className?: string;
  titleId: string;
  artistId: string;
  onSubmitted?: () => void;
  /** Tighter spacing for the phone bottom sheet */
  compact?: boolean;
}

/** Shared upload fields — desktop panel or mobile sheet */
export function AdminLibraryUploadFields({
  className,
  titleId,
  artistId,
  onSubmitted,
  compact = false,
}: AdminLibraryUploadFieldsProps) {
  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        // UI shell only — connect upload later
        onSubmitted?.();
        e.currentTarget.reset();
      }}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 text-center",
          compact ? "min-h-[100px] py-5" : "min-h-[120px] py-7 sm:min-h-[140px]",
        )}
        role="presentation"
      >
        <Music2
          className={cn(
            "text-muted-foreground/45",
            compact ? "size-6" : "size-7 sm:size-8",
          )}
          aria-hidden
        />
        <p className="mt-2.5 text-sm font-medium">
          {compact ? "Pick an audio file" : "Drop an audio file here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          MP3, WAV, or M4A · UI preview only
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-3 h-10 gap-2 font-medium"
        >
          <Upload className="size-4" aria-hidden />
          Choose file
        </Button>
      </div>

      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-1" : "sm:grid-cols-2",
        )}
      >
        <div className="space-y-2">
          <label htmlFor={titleId} className="text-sm font-medium">
            Title
          </label>
          <Input
            id={titleId}
            name="title"
            placeholder="Track title"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={artistId} className="text-sm font-medium">
            Artist
          </label>
          <Input
            id={artistId}
            name="artist"
            placeholder="Artist name"
            className="h-11"
          />
        </div>
      </div>

      <Button
        type="submit"
        className={cn(
          "h-11 font-medium",
          compact ? "w-full" : "w-full sm:w-auto sm:px-6",
        )}
      >
        Add to library
      </Button>
    </form>
  );
}
