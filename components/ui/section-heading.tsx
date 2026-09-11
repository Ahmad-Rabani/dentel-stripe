import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-brass">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-serif text-3xl font-medium leading-tight text-balance text-foreground sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
