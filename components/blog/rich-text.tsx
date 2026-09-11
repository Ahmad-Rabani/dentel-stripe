import { CmsImage } from "@/components/ui/cms-image";
import { isRecord } from "@/lib/strapi/utils";
import type { ReactNode } from "react";

type TextMark = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

function renderText(node: TextMark, index: number) {
  let content: ReactNode = node.text;
  if (node.code) content = <code className="rounded bg-sand px-1 py-0.5 font-mono text-[0.9em]">{content}</code>;
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return <span key={index}>{content}</span>;
}

function childrenOf(node: Record<string, unknown>): ReactNode {
  const children = Array.isArray(node.children) ? node.children : [];
  return children.map((child, index) => {
    if (!isRecord(child)) {
      return null;
    }
    if (typeof child.text === "string") {
      return renderText(child as TextMark, index);
    }
    return <RichTextNode key={index} node={child} />;
  });
}

function RichTextNode({ node }: { node: Record<string, unknown> }) {
  const type = String(node.type ?? "paragraph");

  switch (type) {
    case "heading": {
      const level = Number(node.level ?? 2);
      const className = "font-serif text-balance text-foreground";
      if (level === 1) return <h2 className={`${className} mt-10 text-3xl`}>{childrenOf(node)}</h2>;
      if (level === 3) return <h4 className={`${className} mt-8 text-xl`}>{childrenOf(node)}</h4>;
      return <h3 className={`${className} mt-10 text-2xl`}>{childrenOf(node)}</h3>;
    }
    case "list": {
      const ordered = node.format === "ordered";
      const List = ordered ? "ol" : "ul";
      return (
        <List className={ordered ? "my-5 list-decimal space-y-2 pl-5" : "my-5 list-disc space-y-2 pl-5"}>
          {childrenOf(node)}
        </List>
      );
    }
    case "list-item":
      return <li>{childrenOf(node)}</li>;
    case "quote":
      return (
        <blockquote className="my-6 border-l-2 border-brass pl-5 font-serif text-xl leading-8 text-foreground/90">
          {childrenOf(node)}
        </blockquote>
      );
    case "code":
      return (
        <pre className="my-6 overflow-x-auto rounded-xl bg-forest px-4 py-3 text-sm text-surface">
          <code>{childrenOf(node)}</code>
        </pre>
      );
    case "link":
      return (
        <a
          href={typeof node.url === "string" ? node.url : undefined}
          className="underline decoration-brass underline-offset-4"
        >
          {childrenOf(node)}
        </a>
      );
    case "image": {
      const image = isRecord(node.image) ? node.image : node;
      const url = typeof image.url === "string" ? image.url : "";
      if (!url) return null;
      return (
        <figure className="my-8">
          <CmsImage
            media={{
              url,
              alternativeText: String(image.alternativeText ?? ""),
              width: typeof image.width === "number" ? image.width : null,
              height: typeof image.height === "number" ? image.height : null,
              mime: typeof image.mime === "string" ? image.mime : null,
            }}
            alt={String(image.alternativeText ?? "")}
            className="aspect-[16/10] rounded-2xl"
          />
        </figure>
      );
    }
    default:
      return <p className="my-4 leading-7 text-foreground/85">{childrenOf(node)}</p>;
  }
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function RichText({ content }: { content: unknown }) {
  if (!content) {
    return null;
  }

  if (Array.isArray(content)) {
    return (
      <div className="max-w-none">
        {content.map((node, index) =>
          isRecord(node) ? <RichTextNode key={index} node={node} /> : null,
        )}
      </div>
    );
  }

  if (typeof content === "string") {
    if (looksLikeHtml(content)) {
      return (
        <div
          className="[&_a]:underline [&_a]:decoration-brass [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-2xl [&_p]:my-4 [&_p]:leading-7 [&_p]:text-foreground/85 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return (
      <div className="space-y-4">
        {content.split(/\n{2,}/).map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="leading-7 text-foreground/85">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  return null;
}
