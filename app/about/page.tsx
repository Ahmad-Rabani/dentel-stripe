import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getAboutContent } from "@/lib/strapi/queries";

export const metadata = buildPageMetadata({
  title: "About",
  description: "Dentel designs precision dental systems for practices that value quiet, lasting clinical work.",
  path: "/about",
});

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <>
      <Container className="py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.22em] text-brass">Studio</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl text-balance sm:text-6xl">
          {about.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{about.introduction}</p>
      </Container>

      <section className="border-y border-line bg-sand/40">
        <Container className="grid gap-8 py-16 lg:grid-cols-4">
          {about.statistics.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-brass">{about.missionTitle}</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Work that disappears into skilled hands.</h2>
        </div>
        <p className="max-w-xl text-base leading-8 text-muted">{about.mission}</p>
      </Container>

      <Container className="pb-8">
        <SectionHeading title="How we specify" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {about.values.map((value) => (
            <article key={value.title} className="rounded-2xl border border-line bg-surface px-6 py-7">
              <h3 className="font-serif text-2xl">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{value.body}</p>
            </article>
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <div className="rounded-[2rem] bg-forest px-6 py-12 text-surface sm:px-12">
          <h2 className="max-w-xl font-serif text-3xl sm:text-4xl">{about.ctaTitle}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-surface/75">{about.ctaBody}</p>
          <div className="mt-8">
            <ButtonLink href="/contact" variant="inverse">
              Request a consult
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
