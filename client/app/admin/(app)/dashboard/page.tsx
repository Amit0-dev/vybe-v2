import type { Metadata } from "next";
import { Users } from "lucide-react";
import { AdminStatCard } from "@/features/admin/AdminStatCard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of Spaces, activity, and live listeners across Vybe.",
};

/** Placeholder stats — replace with API aggregates when wiring admin */
const DEMO_STATS = {
  totalSpaces: 48,
  activeSpaces: 31,
  closedSpaces: 17,
  liveUsers: 126,
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Snapshot of Spaces on Vybe and how many people are in them right now.
        </p>
      </header>

      <section
        className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4"
        aria-label="Space statistics"
      >
        <AdminStatCard
          label="Total Spaces"
          value={DEMO_STATS.totalSpaces}
          hint="All Spaces ever created"
        />
        <AdminStatCard
          label="Active"
          value={DEMO_STATS.activeSpaces}
          hint="Spaces currently open"
          tone="active"
        />
        <AdminStatCard
          label="Closed"
          value={DEMO_STATS.closedSpaces}
          hint="Inactive or ended Spaces"
          tone="closed"
        />
        <AdminStatCard
          label="Live users"
          value={DEMO_STATS.liveUsers}
          hint="People currently in active Spaces"
          tone="live"
        />
      </section>

      <section
        className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-6"
        aria-label="Live presence"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary sm:size-10">
            <Users className="size-4 sm:size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Live across Spaces
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold tabular-nums text-foreground">
                {DEMO_STATS.liveUsers}
              </span>{" "}
              people are currently connected across{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {DEMO_STATS.activeSpaces}
              </span>{" "}
              active Spaces.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Friday Night", users: 18, status: "ACTIVE" },
            { name: "Study Session", users: 9, status: "ACTIVE" },
            { name: "Office Vibes", users: 14, status: "ACTIVE" },
          ].map((space) => (
            <div
              key={space.name}
              className="rounded-xl border border-border/60 bg-background/60 px-3.5 py-3 sm:px-4"
            >
              <p className="truncate text-sm font-medium">{space.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="tabular-nums text-foreground">
                  {space.users}
                </span>{" "}
                live · {space.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
