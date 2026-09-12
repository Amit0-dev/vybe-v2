"use client";

import { SpaceHeader } from "@/features/space/SpaceHeader";
import { OwnerPresence } from "@/features/space/OwnerPresence";
import { NowPlaying } from "@/features/playback/NowPlaying";
import { FloatingNowPlaying } from "@/features/playback/FloatingNowPlaying";
import { NowPlayingPreview } from "@/features/playback/NowPlayingPreview";
import { FloatingNowPlayingPreview } from "@/features/playback/FloatingNowPlayingPreview";
import { QueueList } from "@/features/queue/QueueList";
import {
  AddTrackDialog,
  type AddTrackPayload,
} from "@/features/queue/AddTrackDialog";
import { Container } from "@/components/layout/Container";
import type {
  LibraryTrack,
  QueueItem,
  SpaceMember,
  SpaceStatus,
  Track,
} from "@/lib/types";

interface SpaceRoomProps {
  spaceName?: string;
  members?: SpaceMember[];
  /** Current user is the Space host — shows the full audio player */
  isOwner?: boolean;
  /** Host connection status (members see this; owners are always "online" to themselves) */
  isOwnerOnline?: boolean;
  ownerName?: string;
  spaceStatus?: SpaceStatus;
  track?: Track | null;
  queue?: QueueItem[];
  /** Tracks from user storage for the custom picker */
  libraryTracks?: LibraryTrack[];
  libraryLoading?: boolean;
  progressSec?: number;
  isPlaying?: boolean;
  onAddTrack?: (payload: AddTrackPayload) => void;
  onVote?: (queueItemId: string, value: 1 | -1) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSkip?: () => void;
}

export function SpaceRoom({
  spaceName = "Space",
  members = [],
  isOwner = false,
  isOwnerOnline = true,
  ownerName = "Host",
  spaceStatus = "ACTIVE",
  track = null,
  queue = [],
  libraryTracks = [],
  libraryLoading = false,
  progressSec = 0,
  isPlaying = false,
  onAddTrack,
  onVote,
  onPlay,
  onPause,
  onSkip,
}: SpaceRoomProps) {
  if (spaceStatus === "CLOSED") {
    return (
      <div className="vybe-stage vybe-washi flex min-h-full flex-1 flex-col">
        <SpaceHeader spaceName={spaceName} members={members} isOwner={isOwner} />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <Container className="max-w-md text-center">
            <h2 className="font-heading text-xl font-medium tracking-tight">
              This Space is inactive
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The host is no longer connected. You can rejoin when the Space
              becomes active again.
            </p>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="vybe-stage vybe-washi flex h-dvh max-h-dvh flex-1 flex-col overflow-hidden">
      <SpaceHeader
        spaceName={spaceName}
        members={members}
        isOwner={isOwner}
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            {!isOwner && (
              <OwnerPresence
                isOnline={isOwnerOnline}
                ownerName={ownerName}
                className="hidden md:inline-flex"
              />
            )}
            <AddTrackDialog
              onAdd={onAddTrack}
              libraryTracks={libraryTracks}
              libraryLoading={libraryLoading}
            />
          </div>
        }
      />

      <main className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-hidden py-6 sm:py-8">
        <Container className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isOwner ? (
            /* —— Owner ——
               Phone: queue uses full height; host player floats at bottom.
               Desktop: queue + full player side-by-side. */
            <>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[5.25rem] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] lg:gap-8 lg:pb-0">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-card/40 p-4 sm:p-5">
                  <QueueList
                    items={queue}
                    onVote={onVote}
                    className="min-h-0 flex-1"
                  />
                </div>
                <div className="hidden lg:block lg:self-start">
                  <NowPlaying
                    track={track}
                    progressSec={progressSec}
                    isPlaying={isPlaying}
                    onPlay={onPlay}
                    onPause={onPause}
                    onSkip={onSkip}
                    className="h-auto min-h-0"
                  />
                </div>
              </div>

              <FloatingNowPlaying
                track={track}
                progressSec={progressSec}
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
                onSkip={onSkip}
                className="lg:hidden"
              />
            </>
          ) : (
            /* —— Member ——
               Phone: queue full height; now-playing preview floats at bottom.
               Desktop: preview on top + queue below. */
            <>
              <div className="scrollbar-hide mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden pb-[5.25rem] lg:gap-5 lg:overflow-y-auto lg:pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
                <NowPlayingPreview
                  track={track}
                  progressSec={progressSec}
                  isPlaying={isPlaying}
                  isOwnerOnline={isOwnerOnline}
                  ownerName={ownerName}
                  className="hidden shrink-0 lg:block"
                />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-card/40 p-4 sm:p-5 lg:mb-4 lg:h-[min(72dvh,640px)] lg:flex-none">
                  <QueueList
                    items={queue}
                    onVote={onVote}
                    className="min-h-0 flex-1"
                  />
                </div>
              </div>

              <FloatingNowPlayingPreview
                track={track}
                progressSec={progressSec}
                isPlaying={isPlaying}
                isOwnerOnline={isOwnerOnline}
                ownerName={ownerName}
                className="lg:hidden"
              />
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
