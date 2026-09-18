import { apiClient } from "@/lib/api-client";
import { CreateSpaceInput, JoinSpaceInput } from "../schemas/space.schema";

export type SpaceStatus = "ACTIVE" | "CLOSED";
export type SpaceMemberRole = "OWNER" | "PARTICIPANT";

export interface Spaces {
    spaceId: string;
    spaceName: string;
    spaceJoinCode: string;
    spaceStatus: SpaceStatus;
    loggedInUserrole: SpaceMemberRole;
    owner: {
        name: string;
        email: string;
        image: string | null;
    };
    spaceCreatedAt: string;
    membershipJoinedAt: string;
}

interface GetSpacesResponse {
    spaces: Spaces[];
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
