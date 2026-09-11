import { CategoriesSection } from "@/components/sections/categories";
import { CtaSection } from "@/components/sections/cta";
import { FeaturedArticlesSection } from "@/components/sections/featured-articles";
import { FeaturedProductsSection } from "@/components/sections/featured-products";
import { HeroSection } from "@/components/sections/hero";
import { PromoSection } from "@/components/sections/promo";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { buildPageMetadata } from "@/lib/seo";
import {
  getCategories,
  getFeaturedArticles,
  getFeaturedProducts,
  getHomeContent,
  getTestimonials,
} from "@/lib/strapi/queries";

export const metadata = buildPageMetadata({
  title: "Precision dental systems",
  path: "/",
});

export default async function HomePage() {
  const [home, products, categories, articles, testimonials] = await Promise.all([
    getHomeContent(),
    getFeaturedProducts(),
    getCategories(),
    getFeaturedArticles(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSection content={home} />
      <FeaturedProductsSection products={products.items} meta={products.meta} />
      <CategoriesSection categories={categories.items} />
      <PromoSection content={home} />
      <FeaturedArticlesSection articles={articles.items} />
      <TestimonialsSection testimonials={testimonials.items} />
      <CtaSection content={home} />
    </>
  );
}
