import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "active" | "closed" | "live";
  className?: string;
}

const toneClass = {
  default: "border-border/70 bg-card/70",
  active: "border-primary/25 bg-[color-mix(in_srgb,var(--primary)_8%,var(--card))]",
  closed: "border-border/70 bg-muted/50",
  live: "border-primary/30 bg-[color-mix(in_srgb,var(--primary)_10%,var(--card))]",
} as const;

export function AdminStatCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-colors sm:p-5",
        toneClass[tone],
        className,
      )}
    >
      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:text-xs sm:tracking-[0.16em]">
        {label}
      </p>
      <p className="font-heading mt-2.5 text-2xl font-semibold tracking-tight tabular-nums sm:mt-3 sm:text-3xl">
        {value}
      </p>
      {hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
