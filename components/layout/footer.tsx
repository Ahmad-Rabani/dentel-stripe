import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/logo";
import { footerNavigation, mainNavigation } from "@/config/navigation";
import type { SiteSettings } from "@/lib/strapi/types";
import Link from "next/link";

function SocialIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
      </svg>
    );
  }

  if (normalized.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.5 9.5H4V20h2.5V9.5zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.4c0-1.5-.5-2.5-1.8-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20H11.3s.1-8.7 0-9.6H13.8v1.4c.6-.9 1.7-2.2 4.1-2.2 3 0 5.1 1.9 5.1 6.1V20z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h4.4l4.1 5.6L17.7 4H20l-6.4 7.6L20.4 20h-4.4l-4.5-6.1L7 20H4.6l6.7-8.1z"
      />
    </svg>
  );
}

export function Footer({
  settings,
  categoryLinks = [],
}: {
  settings: SiteSettings;
  categoryLinks?: Array<{ href: string; label: string }>;
}) {
  return (
    <footer className="mt-auto bg-forest text-surface">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <Wordmark name={settings.siteName} className="text-surface" />
          <p className="mt-5 text-sm leading-6 text-surface/75">
            {settings.footerContent || settings.description}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Navigate</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-surface/80 transition-colors hover:text-surface">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Catalog</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerNavigation.catalog.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-surface/80 transition-colors hover:text-surface">
                  {item.label}
                </Link>
              </li>
            ))}
            {categoryLinks.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-surface/80 transition-colors hover:text-surface">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Studio</p>
          <address className="mt-4 space-y-2 text-sm not-italic leading-6 text-surface/80">
            <p>{settings.address}</p>
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-surface">
                {settings.email}
              </a>
            </p>
            <p>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-surface">
                {settings.phone}
              </a>
            </p>
            {settings.hours ? <p>{settings.hours}</p> : null}
          </address>
          {settings.socialLinks.length > 0 ? (
            <ul className="mt-5 flex gap-3">
              {settings.socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface/20 text-surface/80 hover:text-surface"
                    aria-label={link.label}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
      <div className="border-t border-surface/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-surface/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <p>Precision dental systems, specified with care.</p>
        </Container>
      </div>
    </footer>
  );
}
