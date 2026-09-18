import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import type { SpaceConnectionStatus } from "../realtime/space-ws.types";

interface SpaceHeaderProps {
  spaceName?: string;
  members?: number;
  connectionStatus?: SpaceConnectionStatus;
  isOwner?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function SpaceHeader({
  spaceName = "Space",
  members = 0,
  connectionStatus = "connecting",
  isOwner = false,
  actions,
  className,
}: SpaceHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border/70 bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/spaces"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to spaces"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-heading truncate text-base font-medium tracking-tight">
                {spaceName}
              </h1>
              {isOwner && (
                <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-primary uppercase">
                  Host
                </span>
              )}
            </div>
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Space
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                connectionStatus === "connected" && "bg-emerald-500",
                connectionStatus === "connecting" && "bg-amber-500",
                connectionStatus === "reconnecting" && "bg-amber-500",
                connectionStatus === "disconnected" && "bg-muted-foreground",
                connectionStatus === "error" && "bg-destructive",
              )}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {connectionStatus === "connected" && "Connected"}
              {connectionStatus === "connecting" && "Connecting"}
              {connectionStatus === "reconnecting" && "Reconnecting"}
              {connectionStatus === "disconnected" && "Disconnected"}
              {connectionStatus === "error" && "Connection error"}
            </span>
          </span>
          {members > 0 && (
            <span className="text-xs text-muted-foreground" aria-label="Member count">
              {members} {members === 1 ? "member" : "members"}
            </span>
          )}
          <ThemeToggle />
          {actions}
        </div>
      </Container>
    </header>
  );
}
