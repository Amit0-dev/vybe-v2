import { SpaceMemberRole, SpaceStatus } from "@/features/spaces/api/spaces.api";
import { apiClient } from "@/lib/api-client";

export interface SpacePreview {
    id: string;
    name: string;
    joinCode: string;
    status: SpaceStatus;
    role: SpaceMemberRole;
    owner: String;
    createdAt: string;
    updatedAt: string;
    isOwner: boolean;
}

export function getSpace(spaceId: string) {
    return apiClient<SpacePreview>(`/api/spaces/${spaceId}`);
}
