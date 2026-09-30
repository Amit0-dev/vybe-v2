import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { AuthNav } from "@/features/auth/components/AuthNav";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Page not found",
};

export default function NotFound() {
    return (
        <div className="vybe-stage flex min-h-full flex-1 flex-col">
            <SiteHeader title="Page not found" right={<AuthNav />} />
            <main className="flex flex-1 items-center py-16 sm:py-24">
                <Container>
                    <div className="mx-auto max-w-xl text-center">
                        <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
                            404
                        </p>
                        <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            This page went quiet.
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            The page you&apos;re looking for doesn&apos;t exist or may have moved.
                        </p>
                        <Link
                            href="/"
                            className={cn(buttonVariants({ size: "lg" }), "mt-8 gap-2")}
                        >
                            <ArrowLeft className="size-4" aria-hidden />
                            Back to Vybe
                        </Link>
                    </div>
                </Container>
            </main>
        </div>
    );
}