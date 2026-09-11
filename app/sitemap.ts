import { absoluteUrl } from "@/lib/seo";
import { getArticles, getCategories, getProducts } from "@/lib/strapi/queries";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([
    getProducts(),
    getCategories(),
    getArticles(),
  ]);

  const staticRoutes = ["/", "/products", "/categories", "/blog", "/about", "/contact"].map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
    }),
  );

  return [
    ...staticRoutes,
    ...products.items.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: new Date(),
    })),
    ...categories.items.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: new Date(),
    })),
    ...articles.items.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: new Date(),
    })),
  ];
}
