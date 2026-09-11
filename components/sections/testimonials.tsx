import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/lib/strapi/types";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [featured, ...rest] = testimonials;

  return (
    <section className="border-y border-line bg-sand/40 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Practices"
          title="What it feels like after the room is specified."
        />
        {testimonials.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Testimonials will appear here"
            description="Add testimonials in Strapi to share practice voices."
          />
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            {featured ? <TestimonialCard testimonial={featured} featured /> : null}
            <div className="grid gap-5">
              {rest.slice(0, 2).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
