import type { ApiQueueItem } from "@/features/queue/types/queue.types";
import type { ApiPlaybackState } from "@/features/playback/types/playback.types";

export type SpaceConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected"
    | "reconnecting"
    | "error";

export type SpaceClosedReason = "ALREADY_CLOSED" | "OWNER_OFFLINE_TIMEOUT";

export interface SpaceSnapshot {
    queue: ApiQueueItem[];
    memberCount: number;
    liveUserCount: number;
    ownerOnline: boolean;
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
            reason: SpaceClosedReason;
      };
