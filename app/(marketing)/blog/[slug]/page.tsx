import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { formatTimestamp } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { getBlogPostBySlug, getBlogPostsList } from "@/queries/blog.api";

export const instant = false;

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const apiPosts = await getBlogPostsList();
    const published = apiPosts.filter((p) => p.published);
    return published.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function BlogDetailSkeleton() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-20 md:py-28 animate-pulse">
      <div className="h-5 w-24 rounded bg-muted" />
      <div className="mt-6 h-4 w-28 rounded bg-muted" />
      <div className="mt-3 h-10 w-3/4 rounded bg-muted" />
      <div className="mt-4 flex items-center gap-3">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="mt-8 aspect-[16/9] w-full rounded-2xl bg-muted" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-4/6 rounded bg-muted" />
      </div>
    </article>
  );
}

async function BlogDetailContent({ params }: BlogPageProps) {
  const { slug } = await params;

  let post: BlogPost | null = null;

  // 1. Fetch via API
  const apiPost = await getBlogPostBySlug(slug);

  if (apiPost && apiPost.published) {
    post = {
      id: apiPost.id,
      slug: apiPost.slug,
      title: apiPost.title,
      image: apiPost.image ?? undefined,
      excerpt: apiPost.excerpt ?? "",
      content: apiPost.content ?? "",
      category: apiPost.category ?? "General",
      author: apiPost.author ?? "Afrin Defence Academy",
      date: apiPost.date ?? "",
      readingTime: apiPost.readingTime ?? "4 min read",
      published: apiPost.published,
    };
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-20 md:py-28">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
      <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {post.category}
      </div>
      <h1 className="font-display mt-2 text-4xl font-bold tracking-tight md:text-5xl">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span>·</span>
        <span>{formatTimestamp(post.date, true)}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {post.readingTime}
        </span>
      </div>
      {post.image && (
        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <p className="mt-8 text-xl font-medium text-foreground/90">{post.excerpt}</p>
      <div className="prose prose-lg mt-6 max-w-none text-foreground/85 leading-relaxed">
        {(post.content || "").split("\n\n").map((para, i) => (
          <p key={i} className="mt-4">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}

export default function BlogDetailPage({ params }: BlogPageProps) {
  return (
    <>
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailContent params={params} />
      </Suspense>
      <CTASection />
    </>
  );
}