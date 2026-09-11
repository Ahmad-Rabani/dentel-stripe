import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-forest text-surface hover:bg-forest-soft border-forest",
  secondary:
    "bg-transparent text-foreground hover:bg-sand/60 border-line",
  inverse:
    "bg-surface text-forest hover:bg-sand border-surface",
  ghost:
    "bg-transparent text-foreground hover:text-forest border-transparent px-0",
} as const;

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-sm",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function classes(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium tracking-[0.02em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
}: SharedProps & { href: string }) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      className={classes(variant, size, className)}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
