import { apiClient } from "@/lib/api-client";
import type { ApiSpaceDetail } from "../types/space.types";

export type { ApiSpaceDetail, SpacePreview } from "../types/space.types";

export function getSpace(spaceId: string) {
    return apiClient<ApiSpaceDetail>(`/api/spaces/${spaceId}`);
}
