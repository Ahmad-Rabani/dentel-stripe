import { strapiPaths } from "@/config/site";
import {
  isStrapiConfigured,
  strapiFetch,
  StrapiRequestError,
  type QueryParams,
} from "@/lib/strapi/client";
import {
  normalizeAboutContent,
  normalizeArticle,
  normalizeCategory,
  normalizeCollection,
  normalizeHomeContent,
  normalizeProduct,
  normalizeSiteSettings,
  normalizeTestimonial,
} from "@/lib/strapi/normalize";
import {
  previewAbout,
  previewArticles,
  previewCategories,
  previewHome,
  previewProducts,
  previewSettings,
  previewTestimonials,
} from "@/lib/strapi/preview";
import type {
  AboutContent,
  Article,
  Category,
  CmsCollection,
  CmsQueryMeta,
  HomeContent,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/strapi/types";

const productPopulate = {
  image: true,
  additionalImages: true,
  category: true,
  specifications: true,
};

const articlePopulate = {
  coverImage: true,
  author: {
    populate: ["avatar"],
  },
};

function previewMeta(): CmsQueryMeta {
  return { source: "preview", unavailable: false };
}

function cmsMeta(): CmsQueryMeta {
  return { source: "cms", unavailable: false };
}

function emptyMeta(unavailable: boolean): CmsQueryMeta {
  return { source: "empty", unavailable };
}

function logCmsError(context: string, error: unknown) {
  if (error instanceof StrapiRequestError) {
    console.error(`[strapi] ${context}: ${error.message}`);
    return;
  }

  console.error(`[strapi] ${context}: request failed`);
}

async function queryCollection<T>(
  path: string,
  normalizeItem: (value: unknown) => T | null,
  fallback: T[],
  params: {
    populate?: QueryParams | string | boolean;
    sort?: string;
    filters?: QueryParams;
    pageSize?: number;
  },
  context: string,
): Promise<CmsCollection<T>> {
  if (!isStrapiConfigured()) {
    return { items: fallback, meta: previewMeta() };
  }

  try {
    const payload = await strapiFetch(path, {
      params: {
        populate: params.populate ?? "*",
        pagination: { pageSize: params.pageSize ?? 50 },
        ...(params.sort ? { sort: params.sort } : {}),
        ...(params.filters ? { filters: params.filters } : {}),
      },
    });

    return {
      items: normalizeCollection(payload, normalizeItem),
      meta: cmsMeta(),
    };
  } catch (error) {
    logCmsError(context, error);
    return { items: [], meta: emptyMeta(true) };
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isStrapiConfigured()) {
    return previewSettings;
  }

  try {
    const payload = await strapiFetch(strapiPaths.siteSettings, {
      params: { populate: "*" },
    });
    return normalizeSiteSettings(payload);
  } catch (error) {
    logCmsError("site settings", error);
    return previewSettings;
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!isStrapiConfigured()) {
    return previewHome;
  }

  try {
    const payload = await strapiFetch(strapiPaths.homePage, {
      params: { populate: "*" },
    });
    return normalizeHomeContent(payload);
  } catch (error) {
    logCmsError("home page", error);
    return normalizeHomeContent(null);
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!isStrapiConfigured()) {
    return previewAbout;
  }

  try {
    const payload = await strapiFetch(strapiPaths.aboutPage, {
      params: { populate: "*" },
    });
    return normalizeAboutContent(payload);
  } catch (error) {
    logCmsError("about page", error);
    return normalizeAboutContent(null);
  }
}

export async function getProducts(): Promise<CmsCollection<Product>> {
  return queryCollection(
    strapiPaths.products,
    normalizeProduct,
    previewProducts,
    { populate: productPopulate, sort: "name:asc" },
    "products",
  );
}

export async function getFeaturedProducts(): Promise<CmsCollection<Product>> {
  const all = await getProducts();
  const featured = all.items.filter((product) => product.featured);
  return {
    items: (featured.length > 0 ? featured : all.items).slice(0, 4),
    meta: all.meta,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isStrapiConfigured()) {
    return previewProducts.find((product) => product.slug === slug) ?? null;
  }

  try {
    const payload = await strapiFetch(strapiPaths.products, {
      params: {
        filters: { slug: { $eq: slug } },
        populate: productPopulate,
        pagination: { pageSize: 1 },
      },
    });
    return normalizeCollection(payload, normalizeProduct)[0] ?? null;
  } catch (error) {
    logCmsError(`product ${slug}`, error);
    return null;
  }
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const { items } = await getProducts();
  const sameCategory = items.filter(
    (item) =>
      item.slug !== product.slug &&
      item.category?.slug &&
      item.category.slug === product.category?.slug,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const extras = items.filter(
    (item) =>
      item.slug !== product.slug &&
      !sameCategory.some((match) => match.slug === item.slug),
  );

  return [...sameCategory, ...extras].slice(0, limit);
}

export async function getCategories(): Promise<CmsCollection<Category>> {
  return queryCollection(
    strapiPaths.categories,
    normalizeCategory,
    previewCategories,
    { populate: { image: true }, sort: "name:asc" },
    "categories",
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isStrapiConfigured()) {
    return previewCategories.find((category) => category.slug === slug) ?? null;
  }

  try {
    const payload = await strapiFetch(strapiPaths.categories, {
      params: {
        filters: { slug: { $eq: slug } },
        populate: { image: true },
        pagination: { pageSize: 1 },
      },
    });
    return normalizeCollection(payload, normalizeCategory)[0] ?? null;
  } catch (error) {
    logCmsError(`category ${slug}`, error);
    return null;
  }
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const { items } = await getProducts();
  return items.filter((product) => product.category?.slug === categorySlug);
}

export async function getArticles(): Promise<CmsCollection<Article>> {
  return queryCollection(
    strapiPaths.articles,
    normalizeArticle,
    previewArticles,
    { populate: articlePopulate, sort: "publishedAt:desc" },
    "articles",
  );
}

export async function getFeaturedArticles(): Promise<CmsCollection<Article>> {
  const all = await getArticles();
  const featured = all.items.filter((article) => article.featured);
  return {
    items: (featured.length > 0 ? featured : all.items).slice(0, 3),
    meta: all.meta,
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isStrapiConfigured()) {
    return previewArticles.find((article) => article.slug === slug) ?? null;
  }

  try {
    const payload = await strapiFetch(strapiPaths.articles, {
      params: {
        filters: { slug: { $eq: slug } },
        populate: articlePopulate,
        pagination: { pageSize: 1 },
      },
    });
    return normalizeCollection(payload, normalizeArticle)[0] ?? null;
  } catch (error) {
    logCmsError(`article ${slug}`, error);
    return null;
  }
}

export async function getRelatedArticles(
  article: Article,
  limit = 3,
): Promise<Article[]> {
  const { items } = await getArticles();
  const sameCategory = items.filter(
    (item) =>
      item.slug !== article.slug &&
      item.category &&
      item.category === article.category,
  );

  const extras = items.filter(
    (item) =>
      item.slug !== article.slug &&
      !sameCategory.some((match) => match.slug === item.slug),
  );

  return [...sameCategory, ...extras].slice(0, limit);
}

export async function getTestimonials(): Promise<CmsCollection<Testimonial>> {
  return queryCollection(
    strapiPaths.testimonials,
    normalizeTestimonial,
    previewTestimonials,
    { populate: { avatar: true } },
    "testimonials",
  );
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; reason: "unconfigured" | "failed" }> {
  if (!isStrapiConfigured()) {
    return { ok: false, reason: "unconfigured" };
  }

  try {
    await strapiFetch(strapiPaths.contactSubmissions, {
      method: "POST",
      revalidate: false,
      body: {
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
        },
      },
    });
    return { ok: true };
  } catch (error) {
    logCmsError("contact submission", error);
    return { ok: false, reason: "failed" };
  }
}
