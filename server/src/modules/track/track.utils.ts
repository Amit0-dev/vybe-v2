import { randomUUID } from "node:crypto";

export function extractYoutubeVideoId(value: string): string | null {
    try {
        const url = new URL(value);

        if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
            return url.searchParams.get("v");
        }

        if (url.hostname === "youtu.be") {
            return url.pathname.slice(1) || null;
        }

        return null;
    } catch (error) {
        return null;
    }
}

export function generateCustomTrackStorageKey(): string {
    return `custom/${randomUUID()}.mp3`;
}
