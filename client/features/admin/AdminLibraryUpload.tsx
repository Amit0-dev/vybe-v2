"use client";

import { useRef, useState } from "react";
import { Music2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createCustomTrackUploadUrl, uploadCustomTrackFile } from "./admin-library.api";

interface AdminLibraryUploadProps {
  className?: string;
  /** Called after the file has been uploaded (e.g. close mobile sheet). */
  onSubmitted?: () => void | Promise<void>;
  /** Prefix form control ids when multiple instances can mount */
  idPrefix?: string;
}

/** Upload panel for the shared custom music library. */
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
  /** Tighter spacing for the phone bottom sheet. */
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!selectedFile) {
          setError("Choose an MP3 file first.");
          return;
        }

        if (selectedFile.type !== "audio/mpeg" && !selectedFile.name.toLowerCase().endsWith(".mp3")) {
          setError("Only MP3 files are supported.");
          return;
        }

        const formData = new FormData(form);
        const title = String(formData.get("title") ?? "").trim();
        const artist = String(formData.get("artist") ?? "").trim();

        if (!title || !artist) {
          setError("Title and artist are required.");
          return;
        }

        setError(null);
        setIsUploading(true);

        try {
          const { uploadUrl } = await createCustomTrackUploadUrl({ title, artist });
          await uploadCustomTrackFile(uploadUrl, selectedFile);
          await onSubmitted?.();
          form.reset();
          setSelectedFile(null);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
        } finally {
          setIsUploading(false);
        }
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
        <p className="mt-1 text-xs text-muted-foreground">MP3 files only</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,.mp3"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setSelectedFile(file);
            setError(null);
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-3 h-10 gap-2 font-medium"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="size-4" aria-hidden />
          {selectedFile ? "Change file" : "Choose file"}
        </Button>
        {selectedFile && (
          <p className="mt-2 max-w-full truncate text-xs text-muted-foreground">
            {selectedFile.name}
          </p>
        )}
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
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Add to library"}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
