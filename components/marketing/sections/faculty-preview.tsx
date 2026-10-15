"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FacultyCard } from "@/components/marketing/cards";
import { stagger } from "@/components/animations/variants";
import { useFacultyQuery } from "@/queries/faculty.queries";
import Link from "next/link";

export function FacultyPreview() {
  const { data: faculty } = useFacultyQuery();

  const list =
    faculty && faculty.length > 0
      ? faculty
          .slice()
          .sort((a, b) => a.order - b.order)
          .slice(0, 3)
          .map((f) => ({
            id: String(f.id),
            name: f.name,
            role: f.role,
            rank: f.rank ?? undefined,
            experience: f.experience || "10+ Years",
            specialization: f.specialization || "Defence Preparation",
            initials: f.initials || "",
          }))
      : [];

  if (list.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Mentors who served"
          title="Faculty drawn from Army, Navy and Air Force"
          description="Decades of operational experience, distilled into a coaching system."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((f) => (
            <FacultyCard key={f.id} faculty={f} />
          ))}
        </motion.div>
        <div className="mt-10 text-center">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-[var(--navy)]"
          >
            Meet the full faculty <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

