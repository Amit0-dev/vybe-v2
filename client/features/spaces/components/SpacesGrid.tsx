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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function SpacesGrid() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, isPending, isFetching, isError, error, refetch } = useSpaces();

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
            <div className="mb-4 flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    aria-label="Refresh spaces"
                >
                    <RefreshCw className={isFetching ? "animate-spin" : undefined} aria-hidden />
                    Refresh spaces
                </Button>
            </div>

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
