"use client";

import { BLOG_POSTS } from "@/constants/data";
import { SectionHeading } from "../custom/section-heading";
import Link from "next/link";
import { stagger } from "../animations/variants";
import { BlogCard } from "../custom/cards";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function LatestBlogs() {
    return (
        <section className="bg-secondary/40 py-20 md:py-28">
            <div className="container mx-auto px-4">
                <SectionHeading eyebrow="Latest from the blog" title="Strategy, syllabus & service insights" />
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {BLOG_POSTS.slice(0, 3).map((p) => (<BlogCard key={p.slug} post={p} />))}
                </motion.div>
                <div className="mt-10 text-center"><Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-[var(--navy)]">All articles <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
        </section>
    )
}


