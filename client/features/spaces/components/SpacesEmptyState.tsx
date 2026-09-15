"use client";

import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpacesEmptyStateProps {
  onCreateClick?: () => void;
}

export function SpacesEmptyState({ onCreateClick }: SpacesEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-vybe-muted text-primary">
          <Music2 className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            No spaces yet
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
            Create your first Space and start a collaborative playlist with your
            crew. Use the card below to get started.
          </p>
          {onCreateClick && (
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto px-0 text-primary"
              onClick={onCreateClick}
            >
              Create Space
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
