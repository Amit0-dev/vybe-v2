"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { createSpaceSchema, type CreateSpaceInput } from "../schemas/space.schema";
import { useForm } from "react-hook-form";
import { ApiError } from "@/lib/api-client";

interface CreateSpaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateSpaceInput) => Promise<void>;
    error: Error | null;
}

export function CreateSpaceDialog({ open, onOpenChange, onSubmit, error }: CreateSpaceDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateSpaceInput>({
        resolver: zodResolver(createSpaceSchema),
        defaultValues: {
            name: "",
            password: "",
        },
    });

    async function handleFormSubmit(values: CreateSpaceInput) {
        await onSubmit(values);

        reset();
        onOpenChange(false);
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen && !isSubmitting) {
            reset();
        }

        onOpenChange(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create a Space</DialogTitle>

                        <DialogDescription>
                            Name your music room and set a password friends will use to join.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="space-name" className="text-sm font-medium">
                                Space name
                            </label>

                            <Input
                                id="space-name"
                                placeholder="Friday Night"
                                maxLength={100}
                                autoComplete="off"
                                className="h-10"
                                aria-invalid={!!errors.name}
                                disabled={isSubmitting}
                                {...register("name")}
                            />

                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="space-password" className="text-sm font-medium">
                                Password
                            </label>

                            <Input
                                id="space-password"
                                type="password"
                                placeholder="At least 6 characters"
                                maxLength={100}
                                autoComplete="new-password"
                                className="h-10"
                                aria-invalid={!!errors.password}
                                disabled={isSubmitting}
                                {...register("password")}
                            />

                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="mt-4 text-sm text-destructive">
                            {error instanceof ApiError
                                ? error.message
                                : "Unable to create the space. Please try again."}
                        </p>
                    )}

                    <DialogFooter className="mt-6 mb-0.5 mr-0.5 border-0 bg-transparent p-0 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
