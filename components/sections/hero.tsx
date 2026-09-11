import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import type { HomeContent } from "@/lib/strapi/types";

export function HeroSection({ content }: { content: HomeContent }) {
  return (
    <section className="overflow-hidden border-b border-line">
      <Container className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        <div className="animate-fade-up">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-brass">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-4xl font-medium leading-[1.1] text-balance text-foreground sm:text-5xl lg:text-[3.5rem]">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
            {content.heroBody}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={content.heroPrimaryCtaHref || "/products"}>
              {content.heroPrimaryCtaLabel}
            </ButtonLink>
            <ButtonLink
              href={content.heroSecondaryCtaHref || "/contact"}
              variant="secondary"
            >
              {content.heroSecondaryCtaLabel}
            </ButtonLink>
          </div>
        </div>
        <div className="animate-fade-up delay-2">
          <CmsImage
            media={content.heroImage}
            alt={content.heroImage?.alternativeText || "Dentel operatory"}
            className="aspect-[4/5] rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 42vw, 100vw"
            priority
          />
        </div>
      </Container>
    </section>
  );
}
