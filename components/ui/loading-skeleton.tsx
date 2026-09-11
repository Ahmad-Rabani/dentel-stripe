import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-sand/80", className)}
      aria-hidden
    />
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function PageHeroSkeleton() {
  return (
    <div className="space-y-6 py-16">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-14 w-3/4 max-w-xl" />
      <Skeleton className="h-20 w-full max-w-2xl" />
    </div>
  );
}
