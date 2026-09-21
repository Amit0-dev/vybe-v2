"use client";

import { useCallback, useState } from "react";
import { SpaceRoom } from "@/features/space/components/SpaceRoom";
import type { ApiQueueItem } from "@/features/queue/types/queue.types";
import { useSpace } from "../hooks/useSpace";
import { useSpaceRealtime } from "../hooks/useSpaceRealtime";
import { useAddYoutubeTrack } from "../hooks/useAddYoutubeTrack";
import type { AddTrackPayload } from "@/features/queue/AddTrackDialog";
import { useVoteQueueItem } from "@/features/queue/hooks/useVoteQueueItem";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

function applyVote(item: ApiQueueItem, value: 1 | -1): ApiQueueItem {
    const prev = item.userVote ?? null;
    let nextVote: 1 | -1 | null;
    let delta: number;

    if (prev === value) {
        // Toggle off
        nextVote = null;
        delta = -value;
    } else if (prev == null) {
        nextVote = value;
        delta = value;
    } else {
        // Switch from opposite vote
        nextVote = value;
        delta = value * 2;
    }

    return {
        ...item,
        userVote: nextVote,
        score: item.score + delta,
    };
}

function sortByScore(items: ApiQueueItem[]): ApiQueueItem[] {
    return [...items].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function SpacePageClient({ spaceId }: { spaceId: string }) {
    const { data: spaceData, isLoading: isSpaceLoading, error: spaceError } = useSpace(spaceId);
    const { status, snapshot, error: realtimeError, applyQueueItem } = useSpaceRealtime(spaceId);
    const addYoutubeMutation = useAddYoutubeTrack(spaceId);

    const voteMutation = useVoteQueueItem(spaceId);

    const { isPending: isAddingTrack, error: addTrackError } = addYoutubeMutation;

    const { isPending: isVoting, error: voteError } = voteMutation;

    const queueList = snapshot?.queue ?? [];
    const memberCount = snapshot?.memberCount ?? 0;
    const currentPlayback = snapshot?.playback ?? null;

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
        [addYoutubeMutation.mutateAsync, applyQueueItem],
    );

    const handleVote = useCallback(
        async (queueItemId: string, value: 1 | -1) => {
            try {
                await voteMutation.mutateAsync({
                    queueItemId,
                    value,
                });
            } catch (error) {
                const message =
                    error instanceof ApiError
                        ? error.message
                        : "Unable to submit vote. Please try again.";

                toast.error(message);
            }
        },
        [voteMutation.mutateAsync],
    );

    const addTrackErrorMessage =
        addTrackError instanceof ApiError
            ? addTrackError.message
            : addTrackError
              ? "Unable to add track. Please try again"
              : null;

    if (isSpaceLoading) {
        return <div>Loading...</div>;
    }

    if (spaceError) {
        return <div>Error loading space.</div>;
    }

    if (!spaceData) {
        return <div>Space data not found.</div>;
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
            queue={queueList}
            libraryTracks={[]}
            connectionStatus={status}
            onAddTrack={handleAddTrack}
            isAddingTrack={isAddingTrack}
            addTrackError={addTrackErrorMessage}
            onVote={handleVote}
            isVoting={isVoting}
        />
    );
}
