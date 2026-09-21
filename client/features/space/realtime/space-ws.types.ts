export type SpaceConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected"
    | "reconnecting"
    | "error";

export type QueueItemStatus = "QUEUED" | "PLAYING" | "PLAYED" | "SKIPPED";

export type TrackSource = "YOUTUBE" | "CUSTOM";

export type QueueItem = {
    id: string;
    spaceId: string;
    trackId: string;
    score: number;
    status: QueueItemStatus;
    createdAt: string;
    updatedAt: string;
    track: {
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
};

export type PlaybackState = {
    track: {
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
    id: string;
    createdAt: string;
    updatedAt: string;
    score: number;
    spaceId: string;
    trackId: string;
    status: QueueItemStatus;
};

export type SpaceSnapshot = {
    queue: QueueItem[];
    memberCount: number;
    playback: PlaybackState | null;
};

export type ServerMessage =
    | {
          type: "SPACE_SNAPSHOT";
          spaceId: string;
          payload: SpaceSnapshot;
      }
    | {
          type: "QUEUE_ITEM_ADDED";
          spaceId: string;
          queueItem: QueueItem;
      }
    | {
          type: "QUEUE_ITEM_SKIPPED";
          spaceId: string;
          queueItemId: string;
      }
    | {
          type: "QUEUE_ITEM_PLAYING";
          spaceId: string;
          queueItemId: string;
      }
    | {
          type: "QUEUE_ITEM_VOTE_UPDATED";
          spaceId: string;
          queueItemId: string;
          score: number;
      };
