import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border bg-card px-6 py-10 sm:flex-row sm:items-center sm:px-10 sm:py-12">
          <div className="max-w-md">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to set the vibe?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Open Spaces and start a room with your crew.
            </p>
          </div>
          <Link
            href="/spaces"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 shrink-0 px-6 text-base font-semibold",
            )}
          >
            Get Started
          </Link>
        </div>
      </Container>
    </section>
  );
}
