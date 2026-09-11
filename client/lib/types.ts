export type SpaceStatus = "ACTIVE" | "CLOSED";
export type QueueItemStatus = "QUEUED" | "PLAYING" | "PLAYED" | "SKIPPED";
export type SpaceMemberRole = "OWNER" | "PARTICIPANT";

export interface SpaceSummary {
  id: string;
  name: string;
  status: SpaceStatus;
  memberCount?: number;
  nowPlaying?: { title: string; artist?: string } | null;
  isOwner?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist?: string;
  durationSec?: number;
  artworkUrl?: string;
}

/** Track available in the user's storage library (custom picker). */
export interface LibraryTrack {
  id: string;
  title: string;
  artist?: string;
  durationSec?: number;
  artworkUrl?: string;
}

export interface QueueItem {
  id: string;
  status: QueueItemStatus;
  score: number;
  track: Track;
  userVote?: 1 | -1 | null;
}

export interface SpaceMember {
  id: string;
  name: string;
  image?: string;
  role: SpaceMemberRole;
}

export interface Space {
  id: string;
  name: string;
  ownerId: string;
  status: SpaceStatus;
  joinCode?: string;
}
