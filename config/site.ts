export const siteConfig = {
  name: "Dentel",
  tagline: "Precision dental systems",
  description:
    "Dentel designs clinical instruments and operatory systems for practices that value quiet precision, lasting materials, and unhurried care.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
