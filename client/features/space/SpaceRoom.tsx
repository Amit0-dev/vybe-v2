"use client";

import { SpaceHeader } from "@/features/space/SpaceHeader";
import { OwnerPresence } from "@/features/space/OwnerPresence";
import { NowPlaying } from "@/features/playback/NowPlaying";
import { NowPlayingPreview } from "@/features/playback/NowPlayingPreview";
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
    <div className="vybe-stage vybe-washi flex min-h-full flex-1 flex-col">
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

      <main className="flex-1 py-6 sm:py-8">
        <Container>
          {isOwner ? (
            /* —— Owner: queue left, full player right —— */
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-8">
              <div className="min-h-[320px] rounded-xl border border-border/70 bg-card/40 p-4 sm:p-5 lg:min-h-[560px]">
                <QueueList items={queue} onVote={onVote} />
              </div>
              <div className="order-first lg:order-none lg:sticky lg:top-6">
                <NowPlaying
                  track={track}
                  progressSec={progressSec}
                  isPlaying={isPlaying}
                  onPlay={onPlay}
                  onPause={onPause}
                  onSkip={onSkip}
                  className="min-h-[420px] lg:min-h-[560px]"
                />
              </div>
            </div>
          ) : (
            /* —— Member: compact preview + queue (no playback controls) —— */
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              <NowPlayingPreview
                track={track}
                progressSec={progressSec}
                isPlaying={isPlaying}
                isOwnerOnline={isOwnerOnline}
                ownerName={ownerName}
              />
              <div className="min-h-[360px] rounded-xl border border-border/70 bg-card/40 p-4 sm:p-5">
                <QueueList items={queue} onVote={onVote} />
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
