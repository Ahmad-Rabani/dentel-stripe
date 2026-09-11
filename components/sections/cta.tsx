import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HomeContent } from "@/lib/strapi/types";

export function CtaSection({ content }: { content: HomeContent }) {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[2rem] border border-line bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-brass">Next step</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl text-balance sm:text-4xl">
            {content.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
            {content.ctaBody}
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/contact">Request a consult</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
