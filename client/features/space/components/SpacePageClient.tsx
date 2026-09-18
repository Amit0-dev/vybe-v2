"use client";

import { useCallback, useState } from "react";
import { SpaceRoom } from "@/features/space/components/SpaceRoom";
import type { QueueItem } from "@/lib/types";
import { useSpace } from "../hooks/useSpace";
import { useSpaceRealtime } from "../hooks/useSpaceRealtime";

function applyVote(item: QueueItem, value: 1 | -1): QueueItem {
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

function sortByScore(items: QueueItem[]): QueueItem[] {
    return [...items].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function SpacePageClient({ spaceId }: { spaceId: string }) {
    const { data: spaceData, isLoading: isSpaceLoading, error: spaceError } = useSpace(spaceId);
    const { status, snapshot, error: realtimeError } = useSpaceRealtime(spaceId);

    const queueList = snapshot?.queue ?? [];
    const memberCount = snapshot?.memberCount ?? 0;
    const currentPlayback = snapshot?.playback ?? null;

    // const onVote = useCallback((queueItemId: string, value: 1 | -1) => {
    //     setQueue((prev) =>
    //         sortByScore(
    //             prev.map((item) => (item.id === queueItemId ? applyVote(item, value) : item)),
    //         ),
    //     );
    // }, []);

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
            isOwner={undefined}
            isOwnerOnline={true}
            ownerName={"Test Owner"}
            spaceStatus={spaceData.status}
            track={currentPlayback}
            queue={queueList}
            libraryTracks={[]}
            connectionStatus={status}
            // onVote={onVote}
        />
    );
}
