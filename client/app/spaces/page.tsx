import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SpacesGrid } from "@/features/spaces/components/SpacesGrid";
import { AuthNav } from "@/features/auth/components/AuthNav";
import { JoinSpaceDialog } from "@/features/spaces/components/JoinSpaceDialog";

export const metadata: Metadata = {
    title: "Spaces",
    description:
        "Browse and open your Vybe Spaces. Create a room, invite friends, and queue music together.",
};

export default function SpacesPage() {
    return (
        <div className="vybe-stage flex min-h-full flex-1 flex-col">
            <SiteHeader title="Your Spaces" right={<AuthNav />} />

            <main className="flex-1 py-10">
                <Container>
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-xl">
                            <h1 className="font-heading text-3xl font-semibold tracking-tight">
                                Spaces
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Open a Space to queue music with your group, or create a new one.
                            </p>
                        </div>

                        <JoinSpaceDialog />
                    </div>

                    <SpacesGrid />
                </Container>
            </main>
        </div>
    );
}
