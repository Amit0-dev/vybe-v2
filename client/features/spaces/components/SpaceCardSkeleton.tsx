import { Skeleton } from "@/components/ui/skeleton";

export function SpaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 p-5">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}