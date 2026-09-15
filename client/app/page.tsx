import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/features/landing/Hero";
import { Features } from "@/features/landing/Features";
import { HowItWorks } from "@/features/landing/HowItWorks";
import { LandingCta } from "@/features/landing/LandingCta";
import { AuthNav } from "@/features/auth/components/AuthNav";

export const metadata: Metadata = {
    title: {
        absolute: "Vybe — Music, together",
    },
    description:
        "Vybe — collaborative music queues for parties and hangouts. One room, one queue, everyone's pick.",
};

export default function LandingPage() {
    return (
        <div className="vybe-stage flex min-h-full flex-1 flex-col">
            <SiteHeader variant="overlay" right={<AuthNav />} />
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <LandingCta />
            </main>
            <footer className="border-t border-border/60 py-8">
                <Container className="text-sm text-muted-foreground">
                    Vybe — collaborative music queues
                </Container>
            </footer>
        </div>
    );
}
