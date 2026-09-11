import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      <rect width="32" height="32" rx="8" fill="#1A3532" />
      <path
        d="M9.2 8h6.1C19.4 8 22.5 11 22.5 16S19.4 24 15.3 24H9.2V8zm3.4 2.7v10.6h2.6c2.4 0 4-1.9 4-5.3s-1.6-5.3-4-5.3h-2.6z"
        fill="#FBFAF6"
      />
    </svg>
  );
}

export function Wordmark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <LogoMark />
      <span className="font-serif text-xl tracking-tight">{name}</span>
    </span>
  );
}
