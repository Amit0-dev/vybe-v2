import axios from "axios";
import { env } from "../../config/env.js";
import e from "express";
import { parseYouTubeDuration } from "./youtube.utils.js";

type YoutubeVideo = {
    id: string;
    title: string;
    channelTitle: string;
    durationSec: number;
};

export async function getYoutubeVideo(videoId: string): Promise<YoutubeVideo | null> {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
            part: "snippet,contentDetails",
            id: videoId,
            key: env.YOUTUBE_API_KEY,
        },
    });

    const item = response.data.items?.[0];

    if (!item) {
        return null;
    }

    return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        durationSec: parseYouTubeDuration(item.contentDetails.duration),
    };
}
