import { getLiveUsersCountInSpace } from "../../realtime/presence.service.js";
import { getPlaybackState } from "../playback/playback.service.js";
import { getQueue } from "../queue/queue.service.js";
import { findSpaceMembers } from "./space.repository.js";

export async function getSpaceRealtimeSnapshot(
    spaceId: string,
    userId: string,
    ownerOnline: boolean,
) {
    const [queue, members, playback, liveUsers] = await Promise.all([
        getQueue(spaceId, userId),
        findSpaceMembers(spaceId),
        getPlaybackState(spaceId),
        getLiveUsersCountInSpace(spaceId),
    ]);

    return {
        queue,
        memberCount: members.length,
        liveUserCount: liveUsers,
        ownerOnline,
        playback,
    };
}
