"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SpaceRoom } from "@/features/space/components/SpaceRoom";
import type { YouTubePlayerHandle } from "@/features/playback/YouTubePlayer";
import { getPlaybackAudioUrl } from "@/features/playback/api/playback.api";
import { useCompletePlayback } from "@/features/playback/hooks/useCompletePlayback";
import { useSkipQueueItem } from "@/features/playback/hooks/useSkipQueueItem";
import { useStartPlayback } from "@/features/playback/hooks/useStartPlayback";
import { useSpace } from "../hooks/useSpace";
import { useSpaceRealtime } from "../hooks/useSpaceRealtime";
import { useAddYoutubeTrack } from "../hooks/useAddYoutubeTrack";
import type { AddTrackPayload } from "@/features/queue/AddTrackDialog";
import { useVoteQueueItem } from "@/features/queue/hooks/useVoteQueueItem";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

export function SpacePageClient({ spaceId }: { spaceId: string }) {
    const { data: spaceData, isLoading: isSpaceLoading, error: spaceError } = useSpace(spaceId);
    const {
        status,
        snapshot,
        error: realtimeError,
        applyQueueItem,
        applyPlayback,
    } = useSpaceRealtime(spaceId);
    const addYoutubeMutation = useAddYoutubeTrack(spaceId);

    const voteMutation = useVoteQueueItem(spaceId);
    const startPlaybackMutation = useStartPlayback(spaceId);
    const completePlaybackMutation = useCompletePlayback(spaceId);
    const skipPlaybackMutation = useSkipQueueItem(spaceId);
    const [userVoteMap, setUserVoteMap] = useState<Map<string, 1 | -1 | null>>(new Map());
    const ytPlayerRef = useRef<YouTubePlayerHandle | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
    const [autoPlayCustomAudio, setAutoPlayCustomAudio] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressSec, setProgressSec] = useState(0);
    const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const loadedPlaybackId = useRef<string | null>(null);

    const { isPending: isAddingTrack, error: addTrackError } = addYoutubeMutation;

    const { isPending: isVoting } = voteMutation;

    const enrichedQueue = useMemo(
        () => {
            const queueList = snapshot?.queue ?? [];

            return queueList.map((item) => ({
                ...item,
                userVote: userVoteMap.has(item.id)
                    ? userVoteMap.get(item.id) ?? null
                    : item.userVote ?? null,
            }));
        },
        [snapshot?.queue, userVoteMap],
    );
    const memberCount = snapshot?.memberCount ?? 0;
    const currentPlayback = snapshot?.playback ?? null;

    const loadPlaybackItem = useCallback(
        async (queueItem: NonNullable<typeof currentPlayback>, autoPlay: boolean) => {
            loadedPlaybackId.current = queueItem.id;
            setProgressSec(0);
            setAutoPlayCustomAudio(autoPlay);

            if (queueItem.track.source === "YOUTUBE" && queueItem.track.sourceId) {
                audioRef.current?.pause();
                setCustomAudioUrl(null);
                ytPlayerRef.current?.loadVideoById(queueItem.track.sourceId);
                return;
            }

            if (queueItem.track.source === "CUSTOM") {
                const { url } = await getPlaybackAudioUrl(spaceId, queueItem.id);
                setCustomAudioUrl(url);
            }
        },
        [spaceId],
    );

    useEffect(() => {
        if (!spaceData?.isOwner || !currentPlayback || loadedPlaybackId.current === currentPlayback.id) {
            return;
        }

        let cancelled = false;

        queueMicrotask(() => {
            if (cancelled) return;

            void loadPlaybackItem(currentPlayback, false).catch(() => {
                toast.error("Could not load audio file");
            });
        });

        return () => {
            cancelled = true;
        };
    }, [currentPlayback, loadPlaybackItem, spaceData?.isOwner]);

    useEffect(() => {
        if (!isPlaying) {
            if (progressInterval.current) clearInterval(progressInterval.current);
            return;
        }

        progressInterval.current = setInterval(() => {
            setProgressSec((current) => current + 1);
        }, 1000);

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [isPlaying]);

    const handlePlay = useCallback(async () => {
        if (currentPlayback) {
            if (currentPlayback.track.source === "YOUTUBE") ytPlayerRef.current?.play();
            if (currentPlayback.track.source === "CUSTOM") void audioRef.current?.play();
            return;
        }

        const response = await startPlaybackMutation.mutateAsync();
        if (response.queueItem) {
            applyPlayback(response.queueItem);
            await loadPlaybackItem(response.queueItem, true);
        }
    }, [applyPlayback, currentPlayback, loadPlaybackItem, startPlaybackMutation]);

    const handlePause = useCallback(() => {
        if (currentPlayback?.track.source === "YOUTUBE") ytPlayerRef.current?.pause();
        if (currentPlayback?.track.source === "CUSTOM") audioRef.current?.pause();
    }, [currentPlayback?.track.source]);

    const handleTrackEnded = useCallback(async () => {
        if (!currentPlayback) return;

        const response = await completePlaybackMutation.mutateAsync(currentPlayback.id);
        const nextQueueItem = response.queueItem.nextQueueItem;

        if (!nextQueueItem) {
            loadedPlaybackId.current = null;
            applyPlayback(null);
            setIsPlaying(false);
            setProgressSec(0);
            return;
        }

        applyPlayback(nextQueueItem);
        await loadPlaybackItem(nextQueueItem, true);
    }, [applyPlayback, completePlaybackMutation, currentPlayback, loadPlaybackItem]);

    const handleSkip = useCallback(async () => {
        if (!currentPlayback) return;

        const response = await skipPlaybackMutation.mutateAsync(currentPlayback.id);
        const nextQueueItem = response.queueItem.nextQueueItem;

        if (!nextQueueItem) {
            loadedPlaybackId.current = null;
            applyPlayback(null);
            ytPlayerRef.current?.stop();
            audioRef.current?.pause();
            setCustomAudioUrl(null);
            setIsPlaying(false);
            setProgressSec(0);
            return;
        }

        applyPlayback(nextQueueItem);
        await loadPlaybackItem(nextQueueItem, true);
    }, [applyPlayback, currentPlayback, loadPlaybackItem, skipPlaybackMutation]);

    const handleAddTrack = useCallback(
        async (payload: AddTrackPayload) => {
            if (payload.source !== "youtube" || !payload.url) {
                throw new Error("Unsupported track source");
            }

            const response = await addYoutubeMutation.mutateAsync(payload.url);

            switch (response.action) {
                case "CREATED": {
                    applyQueueItem(response.queueItem);
                    break;
                }
                case "VOTED_EXISTING": {
                    break;
                }
            }
        },
        [addYoutubeMutation, applyQueueItem],
    );

    const handleVote = useCallback(
        async (queueItemId: string, value: 1 | -1) => {
            try {
                const response = await voteMutation.mutateAsync({
                    queueItemId,
                    value,
                });

                setUserVoteMap((previous) => {
                    const next = new Map(previous);
                    next.set(queueItemId, response.userVote);
                    return next;
                });
            } catch (error) {
                const message =
                    error instanceof ApiError
                        ? error.message
                        : "Unable to submit vote. Please try again.";

                toast.error(message);
            }
        },
        [voteMutation],
    );

    const addTrackErrorMessage =
        addTrackError instanceof ApiError
            ? addTrackError.message
            : addTrackError
              ? "Unable to add track. Please try again"
              : null;

    const errorMessage =
        spaceError instanceof ApiError
            ? spaceError.message
            : realtimeError ?? "Unable to connect to this Space.";

    if (isSpaceLoading) {
        return (
            <div className="vybe-stage vybe-washi flex h-dvh items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="size-10 animate-spin rounded-full border-2 border-border border-t-primary" />
                    <p className="text-sm text-muted-foreground">Connecting to space...</p>
                </div>
            </div>
        );
    }

    if (spaceError) {
        return (
            <div className="vybe-stage flex h-dvh items-center justify-center px-4">
                <div className="w-full max-w-sm rounded-xl border border-destructive/30 bg-card p-8 text-center">
                    <h2 className="font-heading text-lg font-medium">Couldn&apos;t load this Space</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
                    <Link
                        href="/spaces"
                        className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                        Back to Spaces
                    </Link>
                </div>
            </div>
        );
    }

    if (!spaceData) {
        return (
            <div className="vybe-stage flex h-dvh items-center justify-center px-4">
                <div className="w-full max-w-sm rounded-xl border border-destructive/30 bg-card p-8 text-center">
                    <h2 className="font-heading text-lg font-medium">Space not found</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This Space is unavailable or you no longer have access to it.
                    </p>
                    <Link
                        href="/spaces"
                        className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                        Back to Spaces
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <SpaceRoom
            spaceName={spaceData.name}
            members={memberCount}
            isOwner={spaceData.isOwner}
            isOwnerOnline={true}
            ownerName={"Test Owner"}
            spaceStatus={spaceData.status}
            track={currentPlayback}
            progressSec={progressSec}
            isPlaying={isPlaying}
            customAudioUrl={customAudioUrl}
            autoPlayCustomAudio={autoPlayCustomAudio}
            ytPlayerRef={ytPlayerRef}
            audioRef={audioRef}
            onTrackEnded={handleTrackEnded}
            onIsPlayingChange={setIsPlaying}
            queue={enrichedQueue}
            libraryTracks={[]}
            connectionStatus={status}
            onAddTrack={handleAddTrack}
            isAddingTrack={isAddingTrack}
            addTrackError={addTrackErrorMessage}
            onVote={handleVote}
            isVoting={isVoting}
            onPlay={handlePlay}
            onPause={handlePause}
            onSkip={handleSkip}
        />
    );
}
