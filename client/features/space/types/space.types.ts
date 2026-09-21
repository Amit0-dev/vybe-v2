import type { QueueItemStatus, TrackSource } from "../realtime/space-ws.types";

type Track = {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    artist: string | null;
    durationSec: number;
    source: TrackSource;
    sourceId: string | null;
    storageKey: string | null;
};

type CreatedQueueItem = {
    id: string;
    trackId: string;
    spaceId: string;
    status: QueueItemStatus;
    score: number;
    createdAt: string;
    updatedAt: string;
    track: Track;
};

type VotedExistingQueueItem = {
    id: string;
    trackId: string;
    spaceId: string;
    status: QueueItemStatus;
    score: number;
    createdAt: string;
    updatedAt: string;
};

export type AddYouTubeTrackResponse =
    | {
          action: "CREATED";
          queueItem: CreatedQueueItem;
      }
    | {
          action: "VOTED_EXISTING";
          queueItem: VotedExistingQueueItem;
      };
