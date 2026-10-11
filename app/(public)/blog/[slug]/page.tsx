import { CTASection } from "@/components/custom/cta-section";
import { BLOG_POSTS } from "@/constants/data";
import { formatTimestamp } from "@/lib/utils";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((post) => post.slug === slug);
    if (!post) {
        notFound();
    }

    return (
        <>
            <article className="container mx-auto max-w-3xl px-4 py-20 md:py-28">
                <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-navy"><ArrowLeft className="h-4 w-4" /> All articles</Link>
                <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{post.category}</div>
                <h1 className="font-display mt-2 text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{post.author}</span><span>·</span>
                    <span>{formatTimestamp(post.date, true)}</span>
                    <span>·</span><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime}</span>
                </div>
                <p className="mt-8 text-xl font-medium text-foreground/90">{post.excerpt}</p>
                <div className="prose prose-lg mt-6 max-w-none text-foreground/85 leading-relaxed">
                    {post.content.split("\n\n").map((para, i) => (<p key={i} className="mt-4">{para}</p>))}
                </div>
            </article>
            <CTASection />
        </>
    );
}