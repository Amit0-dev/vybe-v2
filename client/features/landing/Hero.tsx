import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 md:min-h-[70vh] md:pb-24">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-primary uppercase sm:mb-5 sm:text-sm">
            Collaborative queues
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            One room. One queue.
            <br />
            <span className="text-primary italic">Everyone&apos;s pick.</span>
          </h1>
          <p className="font-heading mt-4 max-w-lg text-lg font-medium tracking-tight text-foreground/90 sm:mt-5 sm:text-xl md:text-2xl">
            Let others choose the next track.
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/spaces"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 justify-center px-6 text-base font-semibold sm:h-12 sm:px-8",
              )}
            >
              Open Spaces
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 justify-center px-6 text-base sm:h-12 sm:px-8",
              )}
            >
              How it works
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
