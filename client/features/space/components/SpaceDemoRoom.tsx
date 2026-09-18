"use client";

import { useCallback, useState } from "react";
import { SpaceRoom } from "@/features/space/components/SpaceRoom";
import type { LibraryTrack, QueueItem, Track } from "@/lib/types";
import { useSpace } from "../hooks/useSpace";
import { useSession } from "@/features/auth/hooks/useSession";

const PLACEHOLDER_QUEUE: QueueItem[] = [
    {
        id: "q1",
        status: "QUEUED",
        score: 12,
        userVote: 1,
        track: {
            id: "t1",
            title: "Midnight City",
            artist: "M83",
            durationSec: 244,
        },
    },
    {
        id: "q2",
        status: "QUEUED",
        score: 12,
        userVote: null,
        track: {
            id: "t2",
            title: "After Dark",
            artist: "Mr.Kitty",
            durationSec: 259,
        },
    },
    {
        id: "q3",
        status: "QUEUED",
        score: 3,
        userVote: -1,
        track: {
            id: "t3",
            title: "Borderline",
            artist: "Tame Impala",
            durationSec: 238,
        },
    },
    {
        id: "q4",
        status: "QUEUED",
        score: 5,
        userVote: null,
        track: {
            id: "t4",
            title: "Instant Crush",
            artist: "Daft Punk",
            durationSec: 337,
        },
    },
    {
        id: "q5",
        status: "QUEUED",
        score: 2,
        userVote: null,
        track: {
            id: "t5",
            title: "The Less I Know The Better",
            artist: "Tame Impala",
            durationSec: 216,
        },
    },
    {
        id: "q6",
        status: "QUEUED",
        score: 1,
        userVote: null,
        track: {
            id: "t6",
            title: "Nightcall",
            artist: "Kavinsky",
            durationSec: 255,
        },
    },
    {
        id: "q7",
        status: "QUEUED",
        score: 0,
        userVote: null,
        track: {
            id: "t7",
            title: "Sunset",
            artist: "The Weeknd",
            durationSec: 262,
        },
    },
];

const PLACEHOLDER_LIBRARY: LibraryTrack[] = [
    {
        id: "lib1",
        title: "Blinding Lights",
        artist: "The Weeknd",
        durationSec: 200,
        artworkUrl:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop",
    },
    {
        id: "lib2",
        title: "Electric Feel",
        artist: "MGMT",
        durationSec: 229,
        artworkUrl:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=160&h=160&fit=crop",
    },
    {
        id: "lib3",
        title: "Redbone",
        artist: "Childish Gambino",
        durationSec: 326,
        artworkUrl:
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=160&h=160&fit=crop",
    },
    {
        id: "lib4",
        title: "Do I Wanna Know?",
        artist: "Arctic Monkeys",
        durationSec: 272,
        artworkUrl:
            "https://images.unsplash.com/photo-1459749411175-0471761750d6?w=160&h=160&fit=crop",
    },
    {
        id: "lib5",
        title: "Levitating",
        artist: "Dua Lipa",
        durationSec: 203,
        artworkUrl:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&h=160&fit=crop",
    },
    {
        id: "lib6",
        title: "Sunset Lover",
        artist: "Petit Biscuit",
        durationSec: 238,
        artworkUrl:
            "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=160&h=160&fit=crop",
    },
];

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

/**
 * Demo shell: holds placeholder queue in state so votes reorder cards live.
 * Replace with API/WebSocket wiring later — same onVote + sorted list pattern.
 */
export function SpacePageClient({ spaceId }: { spaceId: string }) {
    const { data: spaceData, isLoading: isSpaceLoading, error: spaceError } = useSpace(spaceId);
    const [queue, setQueue] = useState(() => sortByScore([]));

    const onVote = useCallback((queueItemId: string, value: 1 | -1) => {
        setQueue((prev) =>
            sortByScore(
                prev.map((item) => (item.id === queueItemId ? applyVote(item, value) : item)),
            ),
        );
    }, []);

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
            members={[]}
            isOwner={spaceData.isOwner}
            isOwnerOnline={true}
            ownerName={"Owner name test"}
            spaceStatus={spaceData.status}
            track={null}
            queue={queue}
            libraryTracks={[]}
            onVote={onVote}
        />
    );
}
