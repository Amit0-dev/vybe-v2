"use client";

import { useState } from "react";
import { SpaceCard } from "./SpaceCard";
import { CreateSpaceCard } from "./CreateSpaceCard";
import { CreateSpaceDialog } from "./CreateSpaceDialog";
import { SpacesEmptyState } from "./SpacesEmptyState";
import { useSpaces } from "../hooks/useSpaces";
import { SpaceCardSkeleton } from "./SpaceCardSkeleton";
import { useCreateSpace } from "../hooks/useCreateSpace";
import type { CreateSpaceInput } from "../schemas/space.schema";

export function SpacesGrid() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, isPending, isError, error } = useSpaces();

    const createSpaceMutation = useCreateSpace();

    async function handleCreateSpace(values: CreateSpaceInput) {
        await createSpaceMutation.mutateAsync(values);
    }

    if (isPending) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <SpaceCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/30 p-6">
                <p className="font-medium">Unable to load your spaces.</p>
                <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    const spaces = data.spaces;

    return (
        <>
            {spaces.length === 0 && (
                <div className="mb-8">
                    <SpacesEmptyState
                        onCreateClick={() => {
                            createSpaceMutation.reset();
                            setDialogOpen(true);
                        }}
                    />
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.map((space) => (
                    <SpaceCard key={space.spaceId} space={space} />
                ))}
                <CreateSpaceCard
                    onClick={() => {
                        createSpaceMutation.reset();
                        setDialogOpen(true);
                    }}
                />
            </div>

            <CreateSpaceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleCreateSpace}
                error={createSpaceMutation.error}
            />
        </>
    );
}
