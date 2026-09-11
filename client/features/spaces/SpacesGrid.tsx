"use client";

import { useState } from "react";
import type { SpaceSummary } from "@/lib/types";
import { SpaceCard } from "./SpaceCard";
import { CreateSpaceCard } from "./CreateSpaceCard";
import {
  CreateSpaceDialog,
  type CreateSpaceFormData,
} from "./CreateSpaceDialog";
import { SpacesEmptyState } from "./SpacesEmptyState";

interface SpacesGridProps {
  spaces?: SpaceSummary[];
  onCreateSpace?: (data: CreateSpaceFormData) => void;
}

export function SpacesGrid({ spaces = [], onCreateSpace }: SpacesGridProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {spaces.length === 0 && (
        <div className="mb-8">
          <SpacesEmptyState onCreateClick={() => setDialogOpen(true)} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.id} {...space} />
        ))}
        <CreateSpaceCard onClick={() => setDialogOpen(true)} />
      </div>

      <CreateSpaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onCreateSpace}
      />
    </>
  );
}
