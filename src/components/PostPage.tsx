import { Mdx } from "@/components/Mdx";
import { CATEGORY_LABELS, type Post } from "@/lib/content";

export function PostPage({ post }: { post: Post }) {
  const categoryLabel = post.meta.category
    ? CATEGORY_LABELS[post.meta.category] ?? post.meta.category
    : undefined;
  const topicsLabel = post.meta.topics?.length ? post.meta.topics.join(", ") : undefined;

  return (
    <article className="max-w-2xl mx-auto px-6 py-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{post.meta.title}</h1>
        <div className="mt-2 font-mono text-sm text-neutral-500">
          <time dateTime={post.meta.date}>{post.meta.date}</time>
          {categoryLabel ? <> · {categoryLabel}</> : null}
          {topicsLabel ? <> · {topicsLabel}</> : null}
        </div>
      </header>
      <div className="prose prose-neutral dark:prose-invert mt-8">
        <Mdx content={post.content} format={post.format} />
      </div>
    </article>
  );
}
