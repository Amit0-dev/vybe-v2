import type { Metadata } from "next";
import { SpacePageClient } from "@/features/space/components/SpacePageClient";

interface SpacePageProps {
    params: Promise<{ spaceId: string }>;
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{
        spaceName: string;
    }>;
}): Promise<Metadata> {
    const { spaceName } = await searchParams;

    return {
        title: spaceName,
        description: `Hosting ${spaceName} on Vybe — control playback and manage the shared queue.`,
    };
}

export default async function SpacePage({ params }: SpacePageProps) {
    const { spaceId } = await params;

    return <SpacePageClient spaceId={spaceId} />;
}
