import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import type { HomeContent } from "@/lib/strapi/types";

export function PromoSection({ content }: { content: HomeContent }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] bg-forest text-surface lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
            <p className="text-xs uppercase tracking-[0.22em] text-brass">
              {content.promoEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-3xl text-balance sm:text-4xl">
              {content.promoTitle}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-surface/75 sm:text-base">
              {content.promoBody}
            </p>
          </div>
          <CmsImage
            media={content.promoImage}
            alt={content.promoImage?.alternativeText || "Dentel clinical partnership"}
            className="min-h-[280px] lg:min-h-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
