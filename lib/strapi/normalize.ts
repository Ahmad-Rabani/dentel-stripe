import { siteConfig } from "@/config/site";
import type {
  AboutContent,
  AboutStat,
  AboutValue,
  Article,
  ArticleAuthor,
  Category,
  CategorySummary,
  HomeContent,
  Product,
  SiteSettings,
  SocialLink,
  Specification,
  Testimonial,
} from "@/lib/strapi/types";
import {
  asBoolean,
  asNumber,
  asString,
  isRecord,
  normalizeMedia,
  normalizeMediaList,
  unwrapCollection,
  unwrapEntity,
} from "@/lib/strapi/utils";

function entityId(value: Record<string, unknown>, fallback: string): string {
  const id = value.documentId ?? value.id ?? value.slug ?? fallback;
  return String(id);
}

function normalizeCategorySummary(value: unknown): CategorySummary | null {
  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  const name = asString(entity.name);
  const slug = asString(entity.slug);
  if (!name || !slug) {
    return null;
  }

  return {
    id: entityId(entity, slug),
    name,
    slug,
  };
}

function normalizeSpecifications(value: unknown): Specification[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      if (!isRecord(entry)) {
        return [];
      }

      const label = asString(entry.label ?? entry.key ?? entry.name);
      const specValue = asString(entry.value ?? entry.detail);
      return label && specValue ? [{ label, value: specValue }] : [];
    });
  }

  if (isRecord(value)) {
    return Object.entries(value).flatMap(([label, specValue]) => {
      if (specValue == null || typeof specValue === "object") {
        return [];
      }

      return [{ label, value: String(specValue) }];
    });
  }

  return [];
}

export function normalizeCategory(value: unknown): Category | null {
  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  const summary = normalizeCategorySummary(entity);
  if (!summary) {
    return null;
  }

  return {
    ...summary,
    description: asString(entity.description),
    image: normalizeMedia(entity.image),
  };
}

export function normalizeProduct(value: unknown): Product | null {
  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  const name = asString(entity.name);
  const slug = asString(entity.slug);
  if (!name || !slug) {
    return null;
  }

  const gallery = normalizeMediaList(
    entity.additionalImages ?? entity.additional_images ?? entity.gallery,
  );
  const primary = normalizeMedia(entity.image) ?? gallery[0] ?? null;

  return {
    id: entityId(entity, slug),
    name,
    slug,
    price: asNumber(entity.price),
    description: asString(entity.description),
    shortDescription: asString(
      entity.shortDescription ?? entity.short_description ?? entity.excerpt,
    ),
    image: primary,
    additionalImages: gallery.filter((image) => image.url !== primary?.url),
    category: normalizeCategorySummary(entity.category),
    featured: asBoolean(entity.featured),
    specifications: normalizeSpecifications(entity.specifications),
  };
}

function normalizeAuthor(value: unknown): ArticleAuthor | null {
  if (typeof value === "string" && value.trim()) {
    return { name: value, role: "", avatar: null };
  }

  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  const name = asString(entity.name ?? entity.fullname ?? entity.fullName);
  if (!name) {
    return null;
  }

  return {
    name,
    role: asString(entity.role ?? entity.title),
    avatar: normalizeMedia(entity.avatar ?? entity.image),
  };
}

export function normalizeArticle(value: unknown): Article | null {
  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  const title = asString(entity.title);
  const slug = asString(entity.slug);
  if (!title || !slug) {
    return null;
  }

  const categoryEntity = unwrapEntity(entity.category);
  const category =
    asString(entity.category) ||
    asString(categoryEntity?.name) ||
    "";

  return {
    id: entityId(entity, slug),
    title,
    slug,
    excerpt: asString(entity.excerpt ?? entity.summary),
    content: entity.content ?? entity.body ?? "",
    coverImage: normalizeMedia(entity.coverImage ?? entity.cover_image ?? entity.image),
    author: normalizeAuthor(entity.author),
    category,
    featured: asBoolean(entity.featured),
    publishedAt: asString(entity.publishedAt ?? entity.published_at) || null,
  };
}

export function normalizeTestimonial(value: unknown): Testimonial | null {
  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  const name = asString(entity.name);
  const message = asString(entity.message ?? entity.quote);
  if (!name || !message) {
    return null;
  }

  const rating = asNumber(entity.rating);

  return {
    id: entityId(entity, name),
    name,
    role: asString(entity.role ?? entity.title),
    message,
    avatar: normalizeMedia(entity.avatar ?? entity.image),
    rating:
      rating == null ? null : Math.min(5, Math.max(1, Math.round(rating))),
  };
}

function normalizeSocialLinks(value: unknown): SocialLink[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      if (!isRecord(entry)) {
        return [];
      }

      const url = asString(entry.url ?? entry.href);
      const label = asString(entry.label ?? entry.platform ?? entry.name);
      return url ? [{ label: label || url, url }] : [];
    });
  }

  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([label, url]) => {
    return typeof url === "string" && url
      ? [{ label, url }]
      : [];
  });
}

export function normalizeSiteSettings(value: unknown): SiteSettings {
  const entity = unwrapEntity(value);
  const social = normalizeSocialLinks(
    entity?.socialLinks ?? entity?.social_links ?? entity?.social,
  );

  return {
    siteName: asString(entity?.siteName ?? entity?.site_name, siteConfig.name),
    tagline: asString(entity?.tagline, siteConfig.tagline),
    description: asString(entity?.description, siteConfig.description),
    logo: normalizeMedia(entity?.logo),
    favicon: normalizeMedia(entity?.favicon),
    phone: asString(entity?.phone, siteConfig.phone),
    email: asString(entity?.email, siteConfig.email),
    address: asString(entity?.address, siteConfig.address),
    hours: asString(entity?.hours, siteConfig.hours),
    footerContent: asString(entity?.footerContent ?? entity?.footer_content),
    socialLinks:
      social.length > 0
        ? social
        : Object.entries(siteConfig.social).map(([label, url]) => ({
            label,
            url,
          })),
  };
}

export function normalizeHomeContent(value: unknown): HomeContent {
  const entity = unwrapEntity(value);

  return {
    heroEyebrow: asString(entity?.heroEyebrow ?? entity?.hero_eyebrow, "Clinical systems"),
    heroTitle: asString(
      entity?.heroTitle ?? entity?.hero_title,
      "Instruments made for unhurried precision.",
    ),
    heroBody: asString(
      entity?.heroBody ?? entity?.hero_body,
      "Dentel builds operatory tools with a quieter kind of ambition: exact tolerances, considered materials, and a service relationship that lasts longer than a product cycle.",
    ),
    heroImage: normalizeMedia(entity?.heroImage ?? entity?.hero_image),
    heroPrimaryCtaLabel: asString(
      entity?.heroPrimaryCtaLabel ?? entity?.hero_primary_cta_label,
      "View the collection",
    ),
    heroPrimaryCtaHref: asString(
      entity?.heroPrimaryCtaHref ?? entity?.hero_primary_cta_href,
      "/products",
    ),
    heroSecondaryCtaLabel: asString(
      entity?.heroSecondaryCtaLabel ?? entity?.hero_secondary_cta_label,
      "Speak with us",
    ),
    heroSecondaryCtaHref: asString(
      entity?.heroSecondaryCtaHref ?? entity?.hero_secondary_cta_href,
      "/contact",
    ),
    promoEyebrow: asString(entity?.promoEyebrow ?? entity?.promo_eyebrow, "Practice partnership"),
    promoTitle: asString(
      entity?.promoTitle ?? entity?.promo_title,
      "A calibration-first relationship, not a catalog drop.",
    ),
    promoBody: asString(
      entity?.promoBody ?? entity?.promo_body,
      "From chairside handpieces to imaging, every Dentel system is specified with service intervals, parts availability, and training support already in the room.",
    ),
    promoImage: normalizeMedia(entity?.promoImage ?? entity?.promo_image),
    ctaTitle: asString(
      entity?.ctaTitle ?? entity?.cta_title,
      "Specify the next operatory with a quieter standard.",
    ),
    ctaBody: asString(
      entity?.ctaBody ?? entity?.cta_body,
      "Tell us about your rooms, your volume, and the work you want to feel effortless. We will prepare a considered recommendation.",
    ),
  };
}

function normalizeValues(value: unknown): AboutValue[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    const title = asString(entry.title ?? entry.name);
    const body = asString(entry.body ?? entry.description);
    return title && body ? [{ title, body }] : [];
  });
}

function normalizeStats(value: unknown): AboutStat[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    const statValue = asString(entry.value ?? entry.stat);
    const label = asString(entry.label ?? entry.title);
    return statValue && label ? [{ value: statValue, label }] : [];
  });
}

export function normalizeAboutContent(value: unknown): AboutContent {
  const entity = unwrapEntity(value);

  const values = normalizeValues(entity?.values);
  const statistics = normalizeStats(entity?.statistics ?? entity?.stats);

  return {
    title: asString(entity?.title, "A quieter standard for the operatory."),
    introduction: asString(
      entity?.introduction ?? entity?.body,
      "Dentel began with a simple observation: the best clinical work is rarely loud. It is repeatable, well-balanced, and designed around the hand that uses it every hour of the day.",
    ),
    missionTitle: asString(entity?.missionTitle ?? entity?.mission_title, "Mission"),
    mission: asString(
      entity?.mission,
      "To design dental systems that disappear into skilled hands — reducing friction, protecting longevity, and giving clinicians more of the hour for the patient in the chair.",
    ),
    values:
      values.length > 0
        ? values
        : [
            {
              title: "Material honesty",
              body: "We specify steels, ceramics, and finishes for how they age in a real operatory, not how they photograph on a launch day.",
            },
            {
              title: "Serviceable by design",
              body: "Wear parts, calibration, and documentation are part of the product, not an afterthought sold later as a plan.",
            },
            {
              title: "Clinical quiet",
              body: "Balance, noise, and tactile feedback are treated as design constraints equal to power and speed.",
            },
          ],
    statistics:
      statistics.length > 0
        ? statistics
        : [
            { value: "14", label: "Years in clinical manufacturing" },
            { value: "2,400+", label: "Practices equipped" },
            { value: "48h", label: "Average service dispatch" },
            { value: "12", label: "Countries supported" },
          ],
    ctaTitle: asString(entity?.ctaTitle ?? entity?.cta_title, "Visit the studio, or start remotely."),
    ctaBody: asString(
      entity?.ctaBody ?? entity?.cta_body,
      "Whether you are specifying a single room or a multi-site group, we will map the right system with the same care.",
    ),
  };
}

export function normalizeCollection<T>(
  payload: unknown,
  normalizeItem: (value: unknown) => T | null,
): T[] {
  return unwrapCollection(payload)
    .map((entry) => normalizeItem(entry))
    .filter((entry): entry is T => entry !== null);
}
