"use client";

import { useEffect, type RefObject } from "react";

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
    useEffect(() => {
        if (!src || !autoPlay || !playerRef.current) return;

        void playerRef.current.play().catch(() => undefined);
    }, [autoPlay, playerRef, src]);

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
