import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Section = "posts" | "icpc";

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  description?: string;
  category?: string; // posts section
  topics?: string[]; // icpc section
  draft?: boolean;
}

export type PostFormat = "md" | "mdx";

export interface Post {
  meta: PostMeta;
  content: string; // raw markdown body (no frontmatter)
  format: PostFormat;
}

export const CATEGORY_LABELS: Record<string, string> = {
  "frontier-ai": "Frontier AI",
  swe: "SWE",
  quant: "Quant",
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

const MARKDOWN_EXTENSIONS: readonly PostFormat[] = ["mdx", "md"];

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

function readPostFile(section: Section, filename: string): Post {
  const ext = path.extname(filename);
  const slug = path.basename(filename, ext);
  const format: PostFormat = ext === ".mdx" ? "mdx" : "md";
  const fullPath = path.join(CONTENT_ROOT, section, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const meta: PostMeta = {
    slug,
    title: String(data.title),
    date: normalizeDate(data.date),
    description: data.description !== undefined ? String(data.description) : undefined,
    category: data.category !== undefined ? String(data.category) : undefined,
    topics: Array.isArray(data.topics) ? data.topics.map((t) => String(t)) : undefined,
    draft: data.draft !== undefined ? Boolean(data.draft) : undefined,
  };

  return { meta, content, format };
}

function listPostFiles(section: Section): string[] {
  const dir = path.join(CONTENT_ROOT, section);
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((filename) => {
    const ext = path.extname(filename);
    return ext === ".md" || ext === ".mdx";
  });
}

function isDraftInProduction(meta: PostMeta): boolean {
  return meta.draft === true && process.env.NODE_ENV === "production";
}

export function getPosts(section: Section): PostMeta[] {
  const filenames = listPostFiles(section);

  const metas = filenames
    .map((filename) => readPostFile(section, filename).meta)
    .filter((meta) => !isDraftInProduction(meta));

  return metas.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
}

export function getPost(section: Section, slug: string): Post | undefined {
  for (const format of MARKDOWN_EXTENSIONS) {
    const filename = `${slug}.${format}`;
    const fullPath = path.join(CONTENT_ROOT, section, filename);
    if (fs.existsSync(fullPath)) {
      const post = readPostFile(section, filename);
      if (isDraftInProduction(post.meta)) {
        return undefined;
      }
      return post;
    }
  }
  return undefined;
}
