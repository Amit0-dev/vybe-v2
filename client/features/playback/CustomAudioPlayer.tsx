"use client";

import type { RefObject } from "react";

interface CustomAudioPlayerProps {
    src: string;
    autoPlay?: boolean;
    playerRef: RefObject<HTMLAudioElement | null>;
    onEnded: () => void;
    onPlay: () => void;
    onPause: () => void;
}

export function CustomAudioPlayer({
    src,
    autoPlay = false,
    playerRef,
    onEnded,
    onPlay,
    onPause,
}: CustomAudioPlayerProps) {
    return (
        <audio
            ref={playerRef}
            src={src}
            autoPlay={autoPlay}
            onEnded={onEnded}
            onPlay={onPlay}
            onPause={onPause}
            className="sr-only"
            aria-hidden="true"
        />
    );
}
