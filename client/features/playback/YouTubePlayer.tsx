"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

export interface YouTubePlayerHandle {
    loadVideoById: (videoId: string) => void;
    play: () => void;
    pause: () => void;
    stop: () => void;
}

interface YouTubePlayerProps {
    onReady: (handle: YouTubePlayerHandle) => void;
    onEnded: () => void;
    onPlay: () => void;
    onPause: () => void;
}

interface YouTubePlayerInstance {
    loadVideoById: (videoId: string) => void;
    playVideo: () => void;
    pauseVideo: () => void;
    stopVideo: () => void;
}

interface YouTubeNamespace {
    Player: new (
        element: HTMLElement,
        options: {
            height: string;
            width: string;
            playerVars: { autoplay: number; controls: number };
            events: {
                onReady: () => void;
                onStateChange: (event: { data: number }) => void;
            };
        },
    ) => YouTubePlayerInstance;
    PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
    };
}

declare global {
    interface Window {
        YT?: YouTubeNamespace;
        onYouTubeIframeAPIReady?: () => void;
    }
}

export function YouTubePlayer({ onReady, onEnded, onPlay, onPause }: YouTubePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayerInstance | null>(null);

    const initializePlayer = useCallback(() => {
        if (!containerRef.current || !window.YT?.Player || playerRef.current) return;

        playerRef.current = new window.YT.Player(containerRef.current, {
            height: "1",
            width: "1",
            playerVars: { autoplay: 1, controls: 0 },
            events: {
                onReady: () => {
                    const player = playerRef.current;
                    if (!player) return;

                    onReady({
                        loadVideoById: (videoId) => player.loadVideoById(videoId),
                        play: () => player.playVideo(),
                        pause: () => player.pauseVideo(),
                        stop: () => player.stopVideo(),
                    });
                },
                onStateChange: (event) => {
                    if (!window.YT) return;
                    if (event.data === window.YT.PlayerState.ENDED) onEnded();
                    if (event.data === window.YT.PlayerState.PLAYING) onPlay();
                    if (event.data === window.YT.PlayerState.PAUSED) onPause();
                },
            },
        });
    }, [onEnded, onPause, onPlay, onReady]);

    useEffect(() => {
        if (window.YT?.Player) {
            initializePlayer();
            return;
        }

        window.onYouTubeIframeAPIReady = initializePlayer;

        return () => {
            if (window.onYouTubeIframeAPIReady === initializePlayer) {
                window.onYouTubeIframeAPIReady = undefined;
            }
        };
    }, [initializePlayer]);

    return (
        <>
            <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
            <div ref={containerRef} className="sr-only" aria-hidden="true" />
        </>
    );
}
