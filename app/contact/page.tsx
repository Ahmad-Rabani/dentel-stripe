import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/strapi/queries";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Request a consult, specify a room, or speak with Dentel about service and systems.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-brass">Contact</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Tell us about the room.</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted">
          Share a little context — rooms, volume, and what you want to feel effortless. We reply with a considered recommendation, not a generic brochure.
        </p>
        <address className="mt-10 space-y-3 text-sm not-italic leading-6">
          <p>
            <a href={`mailto:${settings.email}`} className="hover:text-forest">
              {settings.email}
            </a>
          </p>
          <p>
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-forest">
              {settings.phone}
            </a>
          </p>
          <p className="text-muted">{settings.address}</p>
          {settings.hours ? <p className="text-muted">{settings.hours}</p> : null}
        </address>
        {settings.socialLinks.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="capitalize underline decoration-brass underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <ContactForm email={settings.email} />
      </div>
    </Container>
  );
}
