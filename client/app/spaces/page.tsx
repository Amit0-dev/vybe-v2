import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SpacesGrid } from "@/features/spaces/SpacesGrid";
import type { SpaceSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Spaces",
  description:
    "Browse and open your Vybe Spaces. Create a room, invite friends, and queue music together.",
};

/** UI placeholders — replace with API data when wiring the backend */
const DEMO_SPACES: SpaceSummary[] = [
  {
    id: "friday-night",
    name: "Friday Night",
    status: "ACTIVE",
    memberCount: 8,
    isOwner: true,
    nowPlaying: { title: "Midnight City", artist: "M83" },
  },
  {
    id: "study-session",
    name: "Study Session",
    status: "ACTIVE",
    memberCount: 4,
    isOwner: false,
    nowPlaying: { title: "Weightless", artist: "Marconi Union" },
  },
  {
    id: "road-trip",
    name: "Road Trip",
    status: "CLOSED",
    memberCount: 3,
    isOwner: true,
    nowPlaying: null,
  },
];

export default function SpacesPage() {
  return (
    <div className="vybe-stage flex min-h-full flex-1 flex-col">
      <SiteHeader
        title="Your Spaces"
        right={
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        }
      />

      <main className="flex-1 py-10">
        <Container>
          <div className="mb-8 max-w-xl">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Spaces
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Open a Space to queue music with your group, or create a new one.
            </p>
          </div>

          {/* Wire spaces + onCreateSpace when connecting the backend */}
          <SpacesGrid spaces={DEMO_SPACES} />
        </Container>
      </main>
    </div>
  );
}
