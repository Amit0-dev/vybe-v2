"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AdminLibraryUpload,
  AdminLibraryUploadFields,
} from "@/features/admin/AdminLibraryUpload";
import {
  AdminLibraryTable,
} from "@/features/admin/AdminLibraryTable";
import { ApiError } from "@/lib/api-client";
import { getAdminCustomTracks } from "./admin-library.api";
import { cn } from "@/lib/utils";

/**
 * Desktop: upload panel + list side by side.
 * Phone: list first; floating upload opens a bottom sheet and closes on submit.
 */
export function AdminLibraryView() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSettlingUpload, setIsSettlingUpload] = useState(false);
  const limit = 20;
  const libraryQuery = useQuery({
    queryKey: ["admin", "custom-tracks", { search, page, limit }],
    queryFn: () => getAdminCustomTracks(search, page, limit),
    refetchInterval: isSettlingUpload ? 2000 : false,
  });
  const tracks = libraryQuery.data?.tracks ?? [];
  const errorMessage =
    libraryQuery.error instanceof ApiError
      ? libraryQuery.error.message
      : libraryQuery.error
        ? "Unable to load library tracks."
        : null;

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    if (libraryQuery.data?.pagination.hasNextPage) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [libraryQuery.data?.pagination.hasNextPage]);

  const adminTracks = tracks.map((track) => ({
    id: track.id,
    title: track.title,
    artist: track.artist ?? undefined,
    durationSec: track.durationSec,
    uploadedAt: new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(track.createdAt),
    ),
  }));

  const handleUploaded = useCallback(async () => {
    setSheetOpen(false);
    setIsSettlingUpload(true);
    await libraryQuery.refetch();
  }, [libraryQuery]);

  useEffect(() => {
    if (!isSettlingUpload) return;

    const timeoutId = window.setTimeout(() => setIsSettlingUpload(false), 10000);
    return () => window.clearTimeout(timeoutId);
  }, [isSettlingUpload]);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col gap-6",
          "lg:grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start",
          "xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]",
        )}
      >
        <AdminLibraryTable
          tracks={adminTracks}
          className="order-1 lg:order-2"
          listClassName="max-h-[min(68dvh,560px)] lg:max-h-[min(58dvh,520px)]"
          emptyHint="No tracks yet. Tap Upload to add the first one."
          isLoading={libraryQuery.isLoading}
          error={errorMessage}
          onSearch={handleSearch}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          page={libraryQuery.data?.pagination.page ?? page}
          canGoPrevious={libraryQuery.data?.pagination.hasPreviousPage ?? page > 1}
          canGoNext={libraryQuery.data?.pagination.hasNextPage ?? false}
        />

        <AdminLibraryUpload
          className="order-2 hidden lg:order-1 lg:block"
          idPrefix="desktop-track"
          onSubmitted={handleUploaded}
        />
      </div>

      <div className="lg:hidden">
        {!sheetOpen && (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="pointer-events-auto mx-auto max-w-lg">
              <Button
                type="button"
                className="h-12 w-full gap-2 rounded-2xl font-medium shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
                onClick={() => setSheetOpen(true)}
              >
                <Plus className="size-5" aria-hidden />
                Upload track
              </Button>
            </div>
          </div>
        )}

        <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
          <DialogContent
            showCloseButton={false}
            className={cn(
              "fixed inset-x-0 bottom-0 top-auto left-0 z-50 grid w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-t-2xl rounded-b-none p-0",
              "max-h-[min(92dvh,640px)] overflow-hidden bg-popover ring-1 ring-foreground/10",
              "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-4",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-4",
            )}
          >
            <div
              className="flex items-center justify-center pt-3 pb-1"
              aria-hidden
            >
              <span className="h-1 w-10 rounded-full bg-border" />
            </div>

            <DialogHeader className="gap-1 px-4 pb-3 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <DialogTitle className="font-heading text-lg font-semibold tracking-tight">
                    Upload track
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Add music to the shared Vybe library.
                  </DialogDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0"
                  aria-label="Close"
                  onClick={() => setSheetOpen(false)}
                >
                  <X className="size-4" aria-hidden />
                </Button>
              </div>
            </DialogHeader>

            <div className="scrollbar-hide max-h-[min(72dvh,520px)] overflow-y-auto overscroll-y-contain px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-5">
              <AdminLibraryUploadFields
                key={sheetOpen ? "open" : "closed"}
                compact
                titleId="mobile-track-title"
                artistId="mobile-track-artist"
                onSubmitted={handleUploaded}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
