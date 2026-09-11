export {
  getAboutContent,
  getArticleBySlug,
  getArticles,
  getCategories,
  getCategoryBySlug,
  getFeaturedArticles,
  getFeaturedProducts,
  getHomeContent,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  getRelatedArticles,
  getRelatedProducts,
  getSiteSettings,
  getTestimonials,
  submitContactMessage,
} from "@/lib/strapi/queries";

export type {
  AboutContent,
  Article,
  Category,
  MediaAsset,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/strapi/types";
