import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "ICPC",
  description: "Notes and learnings from ICPC prep — algorithms, data structures, and contest technique.",
};

export default function IcpcPage() {
  const posts = getPosts("icpc");

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">ICPC</h1>
      <p className="mt-2 text-neutral-500">
        Notes and learnings from ICPC prep — algorithms, data structures, and contest technique.
      </p>
      <div className="mt-8">
        <PostList posts={posts} hrefBase="/icpc" />
      </div>
    </div>
  );
}
