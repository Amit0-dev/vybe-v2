import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/layout/Container";
import type { SpaceMember } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpaceHeaderProps {
  spaceName?: string;
  members?: SpaceMember[];
  isOwner?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SpaceHeader({
  spaceName = "Space",
  members = [],
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

        <div className="flex shrink-0 items-center gap-3">
          {members.length > 0 && (
            <div className="hidden items-center -space-x-2 sm:flex" aria-label="Members">
              {members.slice(0, 4).map((member) => (
                <Avatar
                  key={member.id}
                  className="size-7 border-2 border-background"
                >
                  {member.image && (
                    <AvatarImage src={member.image} alt={member.name} />
                  )}
                  <AvatarFallback className="text-[9px]">
                    {initials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 4 && (
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] text-muted-foreground">
                  +{members.length - 4}
                </span>
              )}
            </div>
          )}
          {actions}
        </div>
      </Container>
    </header>
  );
}
