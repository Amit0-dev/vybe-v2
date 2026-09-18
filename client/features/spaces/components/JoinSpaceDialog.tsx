"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useJoinSpace } from "@/features/spaces/hooks/useJoinSpace";
import { JoinSpaceInput } from "../schemas/space.schema";
import { joinSpaceSchema } from "../schemas/space.schema";

export function JoinSpaceDialog() {
    const router = useRouter();
    const joinSpaceMutation = useJoinSpace();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<JoinSpaceInput>({
        resolver: zodResolver(joinSpaceSchema),
        defaultValues: {
            joinCode: "",
            password: "",
        },
    });

    async function handleFormSubmit(values: JoinSpaceInput) {
        const response = await joinSpaceMutation.mutateAsync(values);

        reset();
        router.push(`/space/${response.membership.spaceId}?spaceName=${response.membership.space.name}`);
    }

    function handleOpenChange(open: boolean) {
        if (!open && !isSubmitting) {
            reset();
            joinSpaceMutation.reset();
        }
    }

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <Button type="button" variant="outline" render={<DialogTrigger />}>
                <LogIn aria-hidden />
                Join Space
            </Button>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Join a Space</DialogTitle>
                        <DialogDescription>
                            Enter the join code and password shared by your host.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="join-space-code" className="text-sm font-medium">
                                Join code
                            </label>
                            <Input
                                id="join-space-code"
                                placeholder="Enter the join code"
                                autoComplete="off"
                                className="h-10"
                                aria-invalid={!!errors.joinCode}
                                disabled={isSubmitting}
                                {...register("joinCode")}
                            />
                            {errors.joinCode && (
                                <p className="text-sm text-destructive">
                                    {errors.joinCode.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="join-space-password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="join-space-password"
                                type="password"
                                placeholder="Enter the space password"
                                autoComplete="current-password"
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

                    {joinSpaceMutation.error && (
                        <p role="alert" className="mt-4 text-sm text-destructive">
                            {joinSpaceMutation.error instanceof ApiError
                                ? joinSpaceMutation.error.message
                                : "Unable to join the space. Please try again."}
                        </p>
                    )}

                    <DialogFooter className="mt-6 mb-0.5 mr-0.5 border-0 bg-transparent p-0 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            render={<DialogClose />}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Joining..." : "Join Space"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
