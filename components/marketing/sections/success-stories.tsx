"use client";

import { stagger } from "@/components/animations/variants";
import { useTestimonialsQuery } from "@/queries/testimonials.queries";
import { motion } from "motion/react";
import { TestimonialCard } from "../cards";

export default function SuccessStories() {
  const { data: testimonials } = useTestimonialsQuery();

  const list =
    testimonials && testimonials.length > 0
      ? testimonials
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((t) => ({
            id: String(t.id),
            name: t.name,
            achievement: t.achievement || "Officer Candidate",
            batch: t.batch || "Batch 2025",
            quote: t.quote,
            initials:
              t.initials ||
              t.name
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase(),
          }))
      : [];

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
