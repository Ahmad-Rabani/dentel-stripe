import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-line bg-surface/70 px-6 py-14 text-center",
        className,
      )}
    >
      <p className="font-serif text-2xl">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}

export function ErrorState({
  title = "Content is temporarily unavailable",
  description = "We could not reach the content service. Please try again in a moment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center">
      <p className="font-serif text-2xl">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}
