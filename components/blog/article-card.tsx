import { CmsImage } from "@/components/ui/cms-image";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/strapi/types";
import Link from "next/link";

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  const date = formatDate(article.publishedAt);

  return (
    <article className={featured ? "grid gap-6 lg:grid-cols-2 lg:items-center" : "flex flex-col"}>
      <Link href={`/blog/${article.slug}`} className="block">
        <CmsImage
          media={article.coverImage}
          alt={article.coverImage?.alternativeText || article.title}
          className={featured ? "aspect-[16/10] rounded-3xl" : "aspect-[16/10] rounded-2xl"}
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
        />
      </Link>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-brass">
          {article.category ? <span>{article.category}</span> : null}
          {date ? <time dateTime={article.publishedAt ?? undefined}>{date}</time> : null}
        </div>
        <h3 className={featured ? "mt-3 font-serif text-3xl sm:text-4xl" : "mt-2 font-serif text-2xl"}>
          <Link href={`/blog/${article.slug}`} className="hover:text-forest">
            {article.title}
          </Link>
        </h3>
        {article.excerpt ? (
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">{article.excerpt}</p>
        ) : null}
        {article.author?.name ? (
          <p className="mt-4 text-sm text-foreground/80">{article.author.name}</p>
        ) : null}
      </div>
    </article>
  );
}
