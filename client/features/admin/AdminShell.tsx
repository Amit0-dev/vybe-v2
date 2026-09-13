"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  ScrollText,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/library", label: "Library", icon: Library },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
] as const;

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="vybe-stage flex min-h-dvh flex-col lg:flex-row">
      {/* Side / top nav */}
      <aside
        className={cn(
          "sticky top-0 z-30 shrink-0 border-b border-border/70 bg-card/90 backdrop-blur-md",
          "pt-[env(safe-area-inset-top)] lg:static lg:flex lg:w-56 lg:flex-col lg:border-r lg:border-b-0 lg:backdrop-blur-none",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-5 lg:h-16">
          <Link
            href="/admin/dashboard"
            className="font-heading min-w-0 truncate text-base font-semibold tracking-tight text-foreground"
          >
            Vybe{" "}
            <span className="font-normal text-muted-foreground">Admin</span>
          </Link>
          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <ThemeToggle />
            <Link
              href="/admin"
              className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <nav
          className={cn(
            "scrollbar-hide flex gap-1 overflow-x-auto overscroll-x-contain px-3 pb-3",
            "lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4",
          )}
          aria-label="Admin"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                  "lg:min-h-0 lg:w-full lg:px-3 lg:py-2.5",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden items-center justify-between gap-2 border-t border-border/60 px-4 py-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/admin"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-3.5" aria-hidden />
            Sign out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main
          className={cn(
            "flex-1 px-4 py-5 sm:px-6 sm:py-6",
            "lg:px-8 lg:py-8",
            "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          )}
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
