"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Clock, GraduationCap, Play, Quote, Star } from "lucide-react";
import type { BlogPost, Course, Faculty, Testimonial } from "@/types";
import { fadeUp } from "@/components/animations/variants";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

import { generateInitials, getYouTubeId } from "@/lib/utils";

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
        {faculty.image ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border/80 shadow-elegant">
            <Image
              src={faculty.image}
              alt={faculty.name}
              fill
              sizes="56px"
              className="object-cover"
              unoptimized={
                faculty.image.startsWith("/storage") ||
                faculty.image.startsWith("http")
              }
            />
          </div>
        ) : (
          <div className="bg-gradient-ocean flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white shadow-elegant">
            {generateInitials(faculty.name)}
          </div>
        )}
        <div><h3 className="font-display text-lg font-semibold leading-tight text-foreground">{faculty.name}</h3><p className="text-xs text-muted-foreground">{faculty.role}</p></div>
      </div>
      {faculty.rank && (<p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-accent">{faculty.rank}</p>)}
      <p className="mt-2 text-sm text-foreground/80">{faculty.specialization}</p>
      <div className="mt-auto pt-4 text-xs text-muted-foreground">{faculty.experience} of experience</div>
    </motion.article>
  );
}
export function TestimonialCard({
  t,
  priority = false,
}: {
  t: Testimonial;
  priority?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(t.youtubeUrl);

  return (
    <motion.figure
      variants={fadeUp}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      {/* Testimonial Video (if available) */}
      {videoId && (
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/90 shadow-sm">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={`${t.name} video review`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="group/video relative h-full w-full cursor-pointer overflow-hidden"
              title="Click to play cadet testimonial video"
            >
              <Image
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={`${t.name} testimonial video preview`}
                fill
                priority={priority}
                loading={priority ? "eager" : undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                className="object-cover transition-transform duration-300 group-hover/video:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 transition-colors group-hover/video:bg-black/25" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-200 group-hover/video:scale-110 group-hover/video:bg-red-500">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                <Play className="h-2.5 w-2.5 fill-white" />
                Cadet Video Review
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quote / Review section */}
      <div className="flex items-center justify-between mb-2">
        <Quote className="h-7 w-7 text-accent/50" />
        {videoId && isPlaying && (
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Close Video
          </button>
        )}
      </div>

      <blockquote className="text-sm leading-relaxed text-foreground/90 md:text-base italic mb-4">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Cadet Information & Avatar */}
      <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
        {t.image ? (
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
            <Image
              src={t.image}
              alt={t.name}
              fill
              priority={priority}
              sizes="44px"
              className="object-cover"
              unoptimized={
                t.image.startsWith("/storage") ||
                t.image.startsWith("http")
              }
            />
          </div>
        ) : (
          <div className="bg-gradient-ocean flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-xs">
            {generateInitials(t.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold text-foreground truncate">{t.name}</div>
          <div className="text-xs text-accent truncate">{t.achievement} · {t.batch}</div>
        </div>
      </figcaption>
    </motion.figure>
  );
}
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article variants={fadeUp} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-elegant">
      <div className="bg-gradient-ocean relative aspect-[16/10] overflow-hidden">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        )}
        <div className="absolute inset-0 flex items-end p-5"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">{post.category}</span></div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {post.readingTime}{post.date && (<span>· {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>)}</div>
        <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent hover:text-[var(--navy)]">Read article <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </motion.article>
  );
}