"use client";

import { cn } from "@/lib/utils";

interface OwnerPresenceProps {
  isOnline?: boolean;
  ownerName?: string;
  className?: string;
}

export function OwnerPresence({
  isOnline = true,
  ownerName = "Host",
  className,
}: OwnerPresenceProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border/70 bg-card/60 px-2.5 py-1.5 text-xs",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          isOnline ? "bg-emerald-400" : "bg-muted-foreground",
        )}
        aria-hidden
      />
      <span className="text-muted-foreground">
        {isOnline ? (
          <>
            <span className="font-medium text-foreground">{ownerName}</span>
            {" is online"}
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{ownerName}</span>
            {" is offline"}
          </>
        )}
      </span>
    </div>
  );
}
