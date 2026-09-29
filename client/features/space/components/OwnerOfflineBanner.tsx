"use client";

import { Clock3, WifiOff } from "lucide-react";

export function OwnerOfflineBanner() {
    return (
        <div
            className="pointer-events-none absolute top-18 right-4 z-40 w-[min(22rem,calc(100%-2rem))] animate-in fade-in-0 slide-in-from-top-2 duration-300 sm:right-6"
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-card/95 px-3.5 py-3 shadow-[0_14px_40px_oklch(0.08_0.01_55/0.28)] backdrop-blur-md">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <WifiOff className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Host is offline</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        This Space will close in 5 minutes unless the host returns.
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
                        <Clock3 className="size-3" aria-hidden />
                        Recovery window active
                    </span>
                </div>
            </div>
        </div>
    );
}