export type QueueItemStatus = "QUEUED" | "PLAYING" | "PLAYED" | "SKIPPED";
export type TrackSource = "YOUTUBE" | "CUSTOM";

export interface ApiTrack {
    id: string;
    title: string;
    artist: string | null;
    durationSec: number;
    source: TrackSource;
    sourceId: string | null;
    storageKey: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ApiQueueItem {
    id: string;
    spaceId: string;
    trackId: string;
    status: QueueItemStatus;
    score: number;
    createdAt: string;
    updatedAt: string;
    track: ApiTrack;
    userVote?: 1 | -1 | null;
}

export interface ApiVoteResponse {
    changed: boolean;
    delta: number;
    vote: -1 | 0 | 1;
    userVote: 1 | -1 | null;
    score: number | null;
}

export interface LibraryTrack {
    id: string;
    title: string;
    artist?: string | null;
    durationSec?: number;
}
