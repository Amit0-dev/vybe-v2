import { apiClient } from "@/lib/api-client";
import { CreateSpaceInput, JoinSpaceInput } from "../schemas/space.schema";
import type { ApiSpaceListItem, SpaceStatus } from "../types/spaces.types";

export type { SpaceStatus, SpaceMemberRole, ApiSpaceListItem, Spaces } from "../types/spaces.types";

interface GetSpacesResponse {
    spaces: ApiSpaceListItem[];
}

export function getSpaces() {
    return apiClient<GetSpacesResponse>("/api/spaces");
}

export interface CreateSpaceResponse {
    space: {
        id: string;
    };
}

export function createSpace(input: CreateSpaceInput) {
    return apiClient<CreateSpaceResponse>("/api/spaces", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export interface JoinSpaceResponse {
    membership: {
        spaceId: string;
        spaceName: string;
    };
}

export function joinSpace(input: JoinSpaceInput) {
    return apiClient<JoinSpaceResponse>("/api/spaces/join", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export interface ReopenSpaceResponse {
    space: {
        id: string;
        name: string;
        joinCode: string;
        status: SpaceStatus;
        ownerId: string;
        createdAt: string;
        updatedAt: string;
    } | null;
}

export function reopenSpace(spaceId: string) {
    return apiClient<ReopenSpaceResponse>(`/api/spaces/${spaceId}/reopen`, {
        method: "POST",
    });
}
