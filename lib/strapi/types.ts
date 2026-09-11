export type MediaAsset = {
  url: string;
  alternativeText: string;
  width: number | null;
  height: number | null;
  mime: string | null;
};

export type Specification = {
  label: string;
  value: string;
};

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type Category = CategorySummary & {
  description: string;
  image: MediaAsset | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  description: string;
  shortDescription: string;
  image: MediaAsset | null;
  additionalImages: MediaAsset[];
  category: CategorySummary | null;
  featured: boolean;
  specifications: Specification[];
};

export type ArticleAuthor = {
  name: string;
  role: string;
  avatar: MediaAsset | null;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  coverImage: MediaAsset | null;
  author: ArticleAuthor | null;
  category: string;
  featured: boolean;
  publishedAt: string | null;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  avatar: MediaAsset | null;
  rating: number | null;
};

export type SocialLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  logo: MediaAsset | null;
  favicon: MediaAsset | null;
  phone: string;
  email: string;
  address: string;
  hours: string;
  footerContent: string;
  socialLinks: SocialLink[];
};

export type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroImage: MediaAsset | null;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  promoEyebrow: string;
  promoTitle: string;
  promoBody: string;
  promoImage: MediaAsset | null;
  ctaTitle: string;
  ctaBody: string;
};

export type AboutValue = {
  title: string;
  body: string;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutContent = {
  title: string;
  introduction: string;
  missionTitle: string;
  mission: string;
  values: AboutValue[];
  statistics: AboutStat[];
  ctaTitle: string;
  ctaBody: string;
};

export type CmsQueryMeta = {
  source: "cms" | "preview" | "empty";
  unavailable: boolean;
};

export type CmsCollection<T> = {
  items: T[];
  meta: CmsQueryMeta;
};
