import { cn } from "@/lib/utils";

export type AdminLogLevel = "info" | "warn" | "error";

export interface AdminLogRow {
  id: string;
  time: string;
  level: AdminLogLevel;
  source: string;
  message: string;
}

interface AdminLogsTableProps {
  logs?: AdminLogRow[];
  className?: string;
}

const levelClass: Record<AdminLogLevel, string> = {
  info: "bg-primary/12 text-primary",
  warn: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  error: "bg-destructive/15 text-destructive",
};

/** Placeholder activity log — remove if unused after wiring */
export function AdminLogsTable({ logs = [], className }: AdminLogsTableProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card/60",
        className,
      )}
      aria-label="System logs"
    >
      <div className="border-b border-border/60 px-4 py-4 sm:px-5">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Recent activity
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Auth, Spaces, and library events (UI preview)
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground sm:px-5">
          No log entries yet.
        </div>
      ) : (
        <div className="scrollbar-hide max-h-[min(70dvh,640px)] overflow-y-auto overscroll-y-contain">
          <ul className="divide-y divide-border/50">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex flex-col gap-2 px-4 py-3.5 sm:grid sm:grid-cols-[6.5rem_4.5rem_5.5rem_1fr] sm:items-start sm:gap-3 sm:px-5 lg:grid-cols-[7rem_4.5rem_6rem_1fr] lg:items-center"
              >
                <div className="flex flex-wrap items-center gap-2 sm:contents">
                  <time className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {log.time}
                  </time>
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase",
                      levelClass[log.level],
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {log.source}
                  </span>
                </div>
                <p className="text-sm leading-snug break-words text-foreground">
                  {log.message}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
