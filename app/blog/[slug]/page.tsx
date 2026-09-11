import { ArticleCard } from "@/components/blog/article-card";
import { RichText } from "@/components/blog/rich-text";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/format";
import { buildPageMetadata } from "@/lib/seo";
import { getArticleBySlug, getRelatedArticles } from "@/lib/strapi/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({ title: "Article", path: `/blog/${slug}` });
  }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`,
    image: article.coverImage,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article);
  const date = formatDate(article.publishedAt);

  return (
    <article>
      <Container className="max-w-3xl py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-brass">
          {article.category ? <span>{article.category}</span> : null}
          {date ? <time dateTime={article.publishedAt ?? undefined}>{date}</time> : null}
        </div>
        <h1 className="mt-4 font-serif text-4xl text-balance sm:text-5xl">{article.title}</h1>
        {article.author?.name ? (
          <p className="mt-4 text-sm text-muted">
            {article.author.name}
            {article.author.role ? ` · ${article.author.role}` : ""}
          </p>
        ) : null}
        {article.excerpt ? (
          <p className="mt-6 text-lg leading-8 text-muted">{article.excerpt}</p>
        ) : null}
      </Container>
      <Container className="max-w-4xl">
        <CmsImage
          media={article.coverImage}
          alt={article.coverImage?.alternativeText || article.title}
          className="aspect-[16/9] rounded-3xl"
          sizes="(min-width: 1024px) 896px, 100vw"
          priority
        />
      </Container>
      <Container className="max-w-3xl py-12">
        <RichText content={article.content} />
      </Container>
      {related.length > 0 ? (
        <Container className="border-t border-line py-16">
          <h2 className="font-serif text-3xl">Related reading</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
