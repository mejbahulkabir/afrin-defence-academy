"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Clock, GraduationCap, Quote, Star } from "lucide-react";
import type { BlogPost, Course, Faculty, Testimonial } from "@/types";
import { fadeUp } from "@/components/animations/variants";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CourseCard({ course }: { course: Course }) {
  return (
    <motion.article variants={fadeUp} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-elegant">
      {course.popular && (<span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent"><Star className="h-3 w-3" /> Popular</span>)}
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--navy-deep)] text-[var(--teal-soft)]"><GraduationCap className="h-5 w-5" /></div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge variant="secondary" className="font-medium">{course.level}</Badge><span>· {course.mode}</span><span>· {course.duration}</span></div>
      <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{course.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
      <ul className="mt-4 space-y-1.5 text-sm">{course.features.slice(0, 3).map((f) => (<li key={f} className="flex items-start gap-2 text-foreground/80"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{f}</li>))}</ul>
      <Link href="/admission" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-[var(--navy)]">Enroll now <ArrowUpRight className="h-4 w-4" /></Link>
    </motion.article>
  );
}
export function FacultyCard({ faculty }: { faculty: Faculty }) {
  return (
    <motion.article variants={fadeUp} className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-ocean flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white shadow-elegant">{faculty.initials}</div>
        <div><h3 className="font-display text-lg font-semibold leading-tight text-foreground">{faculty.name}</h3><p className="text-xs text-muted-foreground">{faculty.role}</p></div>
      </div>
      {faculty.rank && (<p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-accent">{faculty.rank}</p>)}
      <p className="mt-2 text-sm text-foreground/80">{faculty.specialization}</p>
      <div className="mt-auto pt-4 text-xs text-muted-foreground">{faculty.experience} of experience</div>
    </motion.article>
  );
}
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.figure variants={fadeUp} className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Quote className="h-7 w-7 text-accent/50" />
      <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90 md:text-base">"{t.quote}"</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        <div className="bg-gradient-ocean flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white">{t.initials}</div>
        <div><div className="font-display text-sm font-semibold text-foreground">{t.name}</div><div className="text-xs text-accent">{t.achievement} · {t.batch}</div></div>
      </figcaption>
    </motion.figure>
  );
}
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article variants={fadeUp} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-elegant">
      <div className="bg-gradient-ocean relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 flex items-end p-5"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">{post.category}</span></div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {post.readingTime}<span>· {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div>
        <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent hover:text-[var(--navy)]">Read article <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </motion.article>
  );
}