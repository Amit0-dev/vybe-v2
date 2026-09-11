"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateSpaceCardProps {
  onClick?: () => void;
  className?: string;
}

export function CreateSpaceCard({ onClick, className }: CreateSpaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[168px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-transparent p-5 text-muted-foreground transition-all duration-200",
        "hover:border-primary/45 hover:bg-vybe-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full border border-dashed border-current">
        <Plus className="size-5" aria-hidden />
      </span>
      <span className="text-sm font-medium">Create Space</span>
    </button>
  );
}
