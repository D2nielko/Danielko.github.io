import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage } from "@/components/PostPage";
import { getPost, getPosts } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPosts("icpc").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("icpc", slug);
  if (!post) {
    return {};
  }
  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost("icpc", slug);

  if (!post) {
    notFound();
  }

  return <PostPage post={post} />;
}
