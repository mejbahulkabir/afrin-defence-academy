"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../section-heading";
import { stagger } from "@/components/animations/variants";
import { BlogCard } from "../cards";
import { useBlogPostsQuery } from "@/queries/blog.queries";

export default function LatestBlogs() {
  const { data: posts } = useBlogPostsQuery();

  const published = posts?.filter((p) => p.published) ?? [];

  const list =
    published.length > 0
      ? published.slice(0, 3).map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          image: p.image ?? undefined,
          excerpt: p.excerpt || "",
          category: p.category || "Strategy",
          author: p.author || "Faculty Desk",
          date:
            p.date ||
            (p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : ""),
          readingTime: p.readingTime || "5 min read",
          content: p.content || "",
          published: p.published,
        }))
      : [];

  if (list.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Latest from the blog"
          title="Strategy, syllabus & service insights"
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </motion.div>
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-[var(--navy)]"
          >
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}



