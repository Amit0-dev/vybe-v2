import { apiClient } from "@/lib/api-client";
import { CreateSpaceInput } from "../schemas/space.schema";

export type SpaceStatus = "ACTIVE" | "CLOSED";
export type SpaceMemberRole = "OWNER" | "PARTICIPANT";

export interface Space {
    id: string;
    name: string;
    joinCode: string;
    status: SpaceStatus;
    role: SpaceMemberRole;
    createdAt: string;
}

interface GetSpacesResponse {
    spaces: Space[];
}

export function getSpaces() {
    return apiClient<GetSpacesResponse>("/api/spaces");
}

export interface CreateSpaceResponse {
    space: Space;
}

export function createSpace(input: CreateSpaceInput) {
    return apiClient<CreateSpaceResponse>("/api/spaces", {
        method: "POST",
        body: JSON.stringify(input),
    });
}
