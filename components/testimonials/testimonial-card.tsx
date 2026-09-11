import { CmsImage } from "@/components/ui/cms-image";
import type { Testimonial } from "@/lib/strapi/types";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="text-brass" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      <span className="text-line">{"★".repeat(5 - rating)}</span>
    </p>
  );
}

export function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: Testimonial;
  featured?: boolean;
}) {
  return (
    <figure
      className={
        featured
          ? "rounded-3xl bg-surface px-6 py-8 sm:px-10 sm:py-10"
          : "rounded-2xl border border-line bg-surface px-5 py-6"
      }
    >
      {testimonial.rating ? <Stars rating={testimonial.rating} /> : null}
      <blockquote
        className={
          featured
            ? "mt-4 font-serif text-2xl leading-snug text-balance sm:text-3xl"
            : "mt-3 text-sm leading-6 text-foreground/85"
        }
      >
        {testimonial.message}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <CmsImage
          media={testimonial.avatar}
          alt={testimonial.name}
          className="h-11 w-11 rounded-full"
          sizes="44px"
        />
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          {testimonial.role ? (
            <p className="text-xs text-muted">{testimonial.role}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
