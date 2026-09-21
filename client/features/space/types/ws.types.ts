import type { ApiQueueItem } from "@/features/queue/types/queue.types";
import type { ApiPlaybackState } from "@/features/playback/types/playback.types";

export type SpaceConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected"
    | "reconnecting"
    | "error";

export interface SpaceSnapshot {
    queue: ApiQueueItem[];
    memberCount: number;
    playback: ApiPlaybackState | null;
}

export type ServerMessage =
    | {
          type: "SPACE_SNAPSHOT";
          spaceId: string;
          payload: SpaceSnapshot;
      }
    | {
          type: "QUEUE_ITEM_ADDED";
          spaceId: string;
          queueItem: ApiQueueItem;
      }
    | {
          type: "QUEUE_ITEM_SKIPPED";
          spaceId: string;
          queueItemId: string;
      }
    | {
          type: "QUEUE_ITEM_COMPLETED";
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
