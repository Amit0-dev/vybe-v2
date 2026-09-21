export type SpaceStatus = "ACTIVE" | "CLOSED";
export type SpaceMemberRole = "OWNER" | "PARTICIPANT";

export interface ApiSpaceListItem {
    spaceId: string;
    spaceName: string;
    spaceJoinCode: string;
    spaceStatus: SpaceStatus;
    loggedInUserrole: SpaceMemberRole;
    owner: { name: string; email: string; image: string | null };
    spaceCreatedAt: string;
    membershipJoinedAt: string;
}

/** @deprecated Use ApiSpaceListItem */
export type Spaces = ApiSpaceListItem;
