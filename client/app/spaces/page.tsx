import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SpacesGrid } from "@/features/spaces/SpacesGrid";

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
          <SpacesGrid spaces={[]} />
        </Container>
      </main>
    </div>
  );
}
