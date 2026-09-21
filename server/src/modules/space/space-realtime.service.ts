import { getPlaybackState } from "../playback/playback.service.js";
import { getQueue } from "../queue/queue.service.js";
import { findSpaceMembers } from "./space.repository.js";

export async function getSpaceRealtimeSnapshot(spaceId: string, userId: string) {
    const [queue, members, playback] = await Promise.all([
        getQueue(spaceId, userId),
        findSpaceMembers(spaceId),
        getPlaybackState(spaceId),
    ]);

    return {
        queue,
        memberCount: members.length,
        playback,
    };
}
