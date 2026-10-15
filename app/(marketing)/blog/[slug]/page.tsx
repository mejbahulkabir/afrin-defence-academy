import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { formatTimestamp } from "@/lib/utils";
import {
  getBannersServer,
  getBlogBySlugServer,
  getBlogsServer,
  getSiteSettingsServer,
} from "@/lib/server-data";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogsServer();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getBlogBySlugServer(slug),
    getSiteSettingsServer(),
  ]);

  if (!post) {
    return {
      title: `Article Not Found | ${settings.name}`,
    };
  }

  return {
    title: `${post.title} | ${settings.name}`,
    description:
      post.excerpt ||
      `${post.title} — Defence preparation guide by ${post.author || settings.name}`,
    openGraph: {
      title: `${post.title} | ${settings.name}`,
      description: post.excerpt || "",
      images: post.image ? [post.image] : undefined,
      type: "article",
      publishedTime: post.createdAt
        ? new Date(post.createdAt).toISOString()
        : undefined,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt || "",
      images: post.image ? [post.image] : undefined,
    },
  };
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
  const post = await getBlogBySlugServer(slug);

  if (!post || !post.published) {
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
        {post.category || "Strategy"}
      </div>
      <h1 className="font-display mt-2 text-4xl font-bold tracking-tight md:text-5xl">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author || "Faculty Desk"}</span>
        <span>·</span>
        <span>{formatTimestamp(post.date, true)}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {post.readingTime || "5 min read"}
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
      <p className="mt-8 text-xl font-medium text-foreground/90">
        {post.excerpt}
      </p>
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

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const [settings, ctaBanners] = await Promise.all([
    getSiteSettingsServer(),
    getBannersServer("cta"),
  ]);

  return (
    <>
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailContent params={params} />
      </Suspense>
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}