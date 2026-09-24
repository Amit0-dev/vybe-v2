"use client";

import { SpaceHeader } from "./SpaceHeader";
import { OwnerPresence } from "./OwnerPresence";
import { NowPlaying } from "@/features/playback/NowPlaying";
import { FloatingNowPlaying } from "@/features/playback/FloatingNowPlaying";
import { NowPlayingPreview } from "@/features/playback/NowPlayingPreview";
import { FloatingNowPlayingPreview } from "@/features/playback/FloatingNowPlayingPreview";
import { CustomAudioPlayer } from "@/features/playback/CustomAudioPlayer";
import { YouTubePlayer, type YouTubePlayerHandle } from "@/features/playback/YouTubePlayer";
import { QueueList } from "@/features/queue/QueueList";
import { AddTrackDialog, type AddTrackPayload } from "@/features/queue/AddTrackDialog";
import { Container } from "@/components/layout/Container";
import type { LibraryTrack } from "@/features/queue/types/queue.types";
import type { ApiQueueItem } from "@/features/queue/types/queue.types";
import type { ApiPlaybackState } from "@/features/playback/types/playback.types";
import type { SpaceStatus } from "@/features/spaces/types/spaces.types";
import type { SpaceConnectionStatus } from "../types/ws.types";
import type { RefObject } from "react";

interface SpaceRoomProps {
    spaceName?: string;
    members?: number;
    isOwner?: boolean;
    isOwnerOnline?: boolean;
    ownerName?: string;
    spaceStatus?: SpaceStatus;
    track: ApiPlaybackState | null;
    queue?: ApiQueueItem[];
    libraryTracks?: LibraryTrack;
    libraryLoading?: boolean;
    libraryError?: string | null;
    librarySearch?: string;
    onLibrarySearch?: (query: string) => void;
    onPreviousLibraryPage?: () => void;
    onNextLibraryPage?: () => void;
    canGoToPreviousLibraryPage?: boolean;
    canGoToNextLibraryPage?: boolean;
    progressSec?: number;
    isPlaying?: boolean;
    connectionStatus: SpaceConnectionStatus;
    isAddingTrack?: boolean;
    addTrackError?: string | null;
    isVoting: boolean;
    onAddTrack?: (payload: AddTrackPayload) => void | Promise<void>;
    onVote?: (queueItemId: string, value: 1 | -1) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onSkip?: () => void;
    customAudioUrl?: string | null;
    autoPlayCustomAudio?: boolean;
    onTrackEnded?: () => void;
    onIsPlayingChange?: (value: boolean) => void;
    ytPlayerRef?: RefObject<YouTubePlayerHandle | null>;
    audioRef?: RefObject<HTMLAudioElement | null>;
}

export function SpaceRoom({
    spaceName = "Space",
    members = 0,
    isOwner = false,
    isOwnerOnline = true,
    ownerName = "Host",
    spaceStatus = "ACTIVE",
    track = null,
    queue = [],
    libraryTracks,
    libraryLoading = false,
    libraryError,
    librarySearch = "",
    onLibrarySearch,
    onPreviousLibraryPage,
    onNextLibraryPage,
    canGoToPreviousLibraryPage = false,
    canGoToNextLibraryPage = false,
    progressSec = 0,
    isPlaying = false,
    connectionStatus,
    isAddingTrack,
    addTrackError,
    isVoting,
    onAddTrack,
    onVote,
    onPlay,
    onPause,
    onSkip,
    customAudioUrl = null,
    autoPlayCustomAudio = false,
    onTrackEnded,
    onIsPlayingChange,
    ytPlayerRef,
    audioRef,
}: SpaceRoomProps) {
    if (spaceStatus === "CLOSED") {
        return (
            <div className="vybe-stage vybe-washi flex min-h-full flex-1 flex-col">
                <SpaceHeader
                    spaceName={spaceName}
                    members={members}
                    connectionStatus={connectionStatus}
                    isOwner={isOwner}
                />
                <main className="flex flex-1 items-center justify-center px-4 py-16">
                    <Container className="max-w-md text-center">
                        <h2 className="font-heading text-xl font-medium tracking-tight">
                            This Space is inactive
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            The host is no longer connected. You can rejoin when the Space becomes
                            active again.
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
                connectionStatus={connectionStatus}
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
                            isLoading={isAddingTrack}
                            onAddTrackError={addTrackError}
                            libraryTracks={libraryTracks}
                            libraryLoading={libraryLoading}
                            libraryError={libraryError}
                            librarySearch={librarySearch}
                            onLibrarySearch={onLibrarySearch}
                            onPreviousLibraryPage={onPreviousLibraryPage}
                            onNextLibraryPage={onNextLibraryPage}
                            canGoToPreviousLibraryPage={canGoToPreviousLibraryPage}
                            canGoToNextLibraryPage={canGoToNextLibraryPage}
                        />
                    </div>
                }
            />

            <main className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-hidden py-6 sm:py-8">
                <Container className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {isOwner ? (
                        <>
                            <YouTubePlayer
                                videoId={
                                    track?.track.source === "YOUTUBE"
                                        ? track.track.sourceId
                                        : null
                                }
                                onReady={(handle) => {
                                    if (ytPlayerRef) ytPlayerRef.current = handle;
                                }}
                                onEnded={() => onTrackEnded?.()}
                                onPlay={() => onIsPlayingChange?.(true)}
                                onPause={() => onIsPlayingChange?.(false)}
                            />
                            {customAudioUrl && audioRef && (
                                <CustomAudioPlayer
                                    src={customAudioUrl}
                                    autoPlay={autoPlayCustomAudio}
                                    playerRef={audioRef}
                                    onEnded={() => onTrackEnded?.()}
                                    onPlay={() => onIsPlayingChange?.(true)}
                                    onPause={() => onIsPlayingChange?.(false)}
                                />
                            )}
                            <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-21 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] lg:gap-8 lg:pb-0">
                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-card/40 p-4 sm:p-5">
                                    <QueueList
                                        items={queue}
                                        onVote={onVote}
                                        className="min-h-0 flex-1"
                                        isVoting={isVoting}
                                    />
                                </div>
                                <div className="hidden lg:block lg:self-start">
                                    <NowPlaying
                                        track={track?.track ?? null}
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
                                track={track?.track ?? null}
                                progressSec={progressSec}
                                isPlaying={isPlaying}
                                onPlay={onPlay}
                                onPause={onPause}
                                onSkip={onSkip}
                                className="lg:hidden"
                            />
                        </>
                    ) : (
                        <>
                            <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden pb-21 lg:gap-5 lg:pb-0">
                                <NowPlayingPreview
                                    track={track?.track ?? null}
                                    progressSec={progressSec}
                                    isPlaying={isPlaying}
                                    isOwnerOnline={isOwnerOnline}
                                    ownerName={ownerName}
                                    className="hidden shrink-0 lg:block"
                                />
                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-card/40 p-4 sm:p-5">
                                    <QueueList
                                        items={queue}
                                        onVote={onVote}
                                        className="min-h-0 flex-1"
                                        isVoting={isVoting}
                                    />
                                </div>
                            </div>
                            <FloatingNowPlayingPreview
                                track={track?.track ?? null}
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
