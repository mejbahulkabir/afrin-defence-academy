"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { CourseCard } from "@/components/marketing/cards";
import { stagger } from "@/components/animations/variants";
import { useCoursesQuery } from "@/queries/courses.queries";
import Link from "next/link";

export function PopularCourses() {
  const { data: courses } = useCoursesQuery();

  const list =
    courses && courses.length > 0
      ? courses
          .slice()
          .sort((a, b) => a.order - b.order)
          .filter((c) => c.popular)
          .concat(
            courses
              .slice()
              .sort((a, b) => a.order - b.order)
              .filter((c) => !c.popular)
          )
          .slice(0, 3)
          .map((c) => ({
            id: c.id,
            slug: c.slug,
            title: c.title,
            duration: c.duration || "6 Months",
            mode: c.mode,
            level: c.level,
            description: c.description || "",
            features: c.features || [],
            popular: c.popular,
            order: c.order,
          }))
      : [];

  if (list.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Popular Courses"
          title="Programs built for India's toughest exams"
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </motion.div>
        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-[var(--navy)]"
          >
            View all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

