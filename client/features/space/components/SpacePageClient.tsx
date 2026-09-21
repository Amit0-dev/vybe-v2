"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SpaceRoom } from "@/features/space/components/SpaceRoom";
import { useSpace } from "../hooks/useSpace";
import { useSpaceRealtime } from "../hooks/useSpaceRealtime";
import { useAddYoutubeTrack } from "../hooks/useAddYoutubeTrack";
import type { AddTrackPayload } from "@/features/queue/AddTrackDialog";
import { useVoteQueueItem } from "@/features/queue/hooks/useVoteQueueItem";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

export function SpacePageClient({ spaceId }: { spaceId: string }) {
    const { data: spaceData, isLoading: isSpaceLoading, error: spaceError } = useSpace(spaceId);
    const { status, snapshot, error: realtimeError, applyQueueItem } = useSpaceRealtime(spaceId);
    const addYoutubeMutation = useAddYoutubeTrack(spaceId);

    const voteMutation = useVoteQueueItem(spaceId);
    const [userVoteMap, setUserVoteMap] = useState<Map<string, 1 | -1 | null>>(new Map());

    const { isPending: isAddingTrack, error: addTrackError } = addYoutubeMutation;

    const { isPending: isVoting, error: voteError } = voteMutation;

    const queueList = snapshot?.queue ?? [];
    const enrichedQueue = useMemo(
        () =>
            queueList.map((item) => ({
                ...item,
                userVote: userVoteMap.has(item.id)
                    ? userVoteMap.get(item.id) ?? null
                    : item.userVote ?? null,
            })),
        [queueList, userVoteMap],
    );
    const memberCount = snapshot?.memberCount ?? 0;
    const currentPlayback = snapshot?.playback ?? null;

    useEffect(() => {
        const serverVotes = queueList.filter((item) => item.userVote !== undefined);

        if (serverVotes.length === 0) return;

        setUserVoteMap((previous) => {
            const next = new Map(previous);
            let changed = false;

            for (const item of serverVotes) {
                if (next.get(item.id) !== item.userVote) {
                    next.set(item.id, item.userVote ?? null);
                    changed = true;
                }
            }

            return changed ? next : previous;
        });
    }, [queueList]);

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
            queue={enrichedQueue}
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
