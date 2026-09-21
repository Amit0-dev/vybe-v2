import type { SpaceMemberRole, SpaceStatus } from "@/features/spaces/types/spaces.types";
import type { ApiQueueItem } from "@/features/queue/types/queue.types";

export interface ApiSpaceDetail {
    id: string;
    name: string;
    joinCode: string;
    status: SpaceStatus;
    role: SpaceMemberRole;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    isOwner: boolean;
}

/** @deprecated Use ApiSpaceDetail */
export type SpacePreview = ApiSpaceDetail;

type VotedExistingQueueItem = Omit<ApiQueueItem, "track">;

export type AddYouTubeTrackResponse =
    | {
          action: "CREATED";
          queueItem: ApiQueueItem;
      }
    | {
          action: "VOTED_EXISTING";
          queueItem: VotedExistingQueueItem;
      };
