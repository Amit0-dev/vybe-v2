import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  title?: string;
  right?: React.ReactNode;
  className?: string;
  /** Transparent over hero vs solid bar */
  variant?: "overlay" | "solid";
}

export function SiteHeader({
  title,
  right,
  className,
  variant = "solid",
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "z-20 w-full",
        variant === "solid" &&
          "border-b border-border/70 bg-background/80 backdrop-blur-md",
        variant === "overlay" && "absolute inset-x-0 top-0",
        className,
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="shrink-0 text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            Vybe
          </Link>
          {title && (
            <span className="truncate text-sm text-muted-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {right}
        </div>
      </Container>
    </header>
  );
}
