import axios, { type AxiosResponse } from "axios";
import { env } from "../../config/env.js";
import { parseYouTubeDuration } from "./youtube.utils.js";
import { ExternalServiceError } from "../../lib/errors.js";

type YoutubeVideo = {
    id: string;
    title: string;
    channelTitle: string;
    durationSec: number;
};

async function fetchYoutubeVideo(videoId: string) {
    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
            params: {
                part: "snippet,contentDetails",
                id: videoId,
                key: env.YOUTUBE_API_KEY,
            },
        });

        return response;
    } catch (error) {
        throw new ExternalServiceError("Unable to fetch Youtube video", "YOUTUBE_API_ERROR");
    }
}

export async function getYoutubeVideo(videoId: string): Promise<YoutubeVideo | null> {
    const response = await fetchYoutubeVideo(videoId);

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
