function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      // Fall through to Vercel or local defaults.
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Dentel",
  tagline: "Precision dental systems",
  description:
    "Dentel designs clinical instruments and operatory systems for practices that value quiet precision, lasting materials, and unhurried care.",
  url: resolveSiteUrl(),
  locale: "en_US",
  email: "hello@dentel.studio",
  phone: "+1 (212) 555-0148",
  address: "418 Mercer Street, New York, NY 10012",
  hours: "Monday–Friday, 9:00–18:00 ET",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
  },
} as const;

export const strapiPaths = {
  products: "/api/products",
  categories: "/api/categories",
  articles: "/api/articles",
  testimonials: "/api/testimonials",
  siteSettings: "/api/site-setting",
  homePage: "/api/home-page",
  aboutPage: "/api/about-page",
  contactSubmissions: "/api/contact-submissions",
} as const;

export const cmsRevalidateSeconds = 60;
