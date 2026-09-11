"use client";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/logo";
import { mainNavigation } from "@/config/navigation";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/lib/strapi/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-background/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Link href="/" aria-label={`${settings.siteName} home`} className="shrink-0">
            <Wordmark name={settings.siteName} />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
            {mainNavigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-[0.02em] transition-colors",
                    active ? "text-forest" : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <ButtonLink href="/contact" size="sm">
              Request a consult
            </ButtonLink>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  "absolute left-0 h-px w-4 bg-foreground transition-transform duration-200",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-4 bg-foreground transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-4 bg-foreground transition-transform duration-200",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </Container>
      </header>

      {open ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-background lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-5" as="nav">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base text-foreground hover:bg-sand/70"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/contact" className="mt-3 w-full">
              Request a consult
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </>
  );
}
