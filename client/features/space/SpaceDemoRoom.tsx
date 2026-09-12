"use client";

import { useCallback, useState } from "react";
import { SpaceRoom } from "@/features/space/SpaceRoom";
import type { LibraryTrack, QueueItem, Track } from "@/lib/types";

interface SpaceDemoRoomProps {
  spaceName?: string;
  isOwner?: boolean;
  isOwnerOnline?: boolean;
  ownerName?: string;
  initialQueue?: QueueItem[];
  libraryTracks?: LibraryTrack[];
  track?: Track | null;
}

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
  return [...items].sort(
    (a, b) => b.score - a.score || a.id.localeCompare(b.id),
  );
}

/**
 * Demo shell: holds placeholder queue in state so votes reorder cards live.
 * Replace with API/WebSocket wiring later — same onVote + sorted list pattern.
 */
export function SpaceDemoRoom({
  spaceName = "Space",
  isOwner = false,
  isOwnerOnline = true,
  ownerName = "Host",
  initialQueue = [],
  libraryTracks = [],
  track = null,
}: SpaceDemoRoomProps) {
  const [queue, setQueue] = useState(() => sortByScore(initialQueue));

  const onVote = useCallback((queueItemId: string, value: 1 | -1) => {
    setQueue((prev) =>
      sortByScore(
        prev.map((item) =>
          item.id === queueItemId ? applyVote(item, value) : item,
        ),
      ),
    );
  }, []);

  return (
    <SpaceRoom
      spaceName={spaceName}
      members={[]}
      isOwner={isOwner}
      isOwnerOnline={isOwnerOnline}
      ownerName={ownerName}
      spaceStatus="ACTIVE"
      track={track}
      queue={queue}
      libraryTracks={libraryTracks}
      onVote={onVote}
    />
  );
}
