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
    liveUserCount: number;
    playback: ApiPlaybackState | null;
}

export type ServerMessage =
    | {
          type: "SPACE_SNAPSHOT";
          spaceId: string;
          payload: SpaceSnapshot;
      }
    | {
          type: "SPACE_MEMBER_JOINED";
          spaceId: string;
      }
    | {
          type: "LIVE_USER_COUNT_UPDATED";
          spaceId: string;
          liveUserCount: number;
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
        }
        | {
            type: "OWNER_OFFLINE";
            spaceId: string;
        }
        | {
            type: "OWNER_ONLINE";
            spaceId: string;
        }
        | {
            type: "SPACE_CLOSED";
            spaceId: string;
            reason: "OWNER_OFFLINE";
      };
