import { siteConfig } from "@/config/site";
import { getStrapiMediaUrl } from "@/lib/strapi/utils";
import type { MediaAsset } from "@/lib/strapi/types";
import type { Metadata } from "next";

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  image?: MediaAsset | string | null;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteConfig.url).toString();
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = getStrapiMediaUrl(image);
  const resolvedDescription = description || siteConfig.description;

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: imageUrl
        ? [{ url: imageUrl, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resolvedDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
