"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

import { BlogCard } from "../cards";
import { stagger } from "@/components/animations/variants";
import { useBlogPostsQuery } from "@/queries/blog.queries";
import type { BlogPost } from "@/types";

export default function AllBlogs() {
  const { data: apiPosts } = useBlogPostsQuery();

  const posts: BlogPost[] = useMemo(() => {
    if (apiPosts && apiPosts.length > 0) {
      const published = apiPosts.filter((p) => p.published);
      if (published.length > 0) {
        return published.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          image: p.image ?? undefined,
          excerpt: p.excerpt ?? "",
          content: p.content ?? "",
          category: p.category ?? "General",
          author: p.author ?? "Afrin Defence Academy",
          date: p.date ?? "",
          readingTime: p.readingTime ?? "4 min read",
          published: p.published,
        }));
      }
    }
    return [];
  }, [apiPosts]);

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
