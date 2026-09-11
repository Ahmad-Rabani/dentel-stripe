import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}
    >
      {children}
    </Component>
  );
}
