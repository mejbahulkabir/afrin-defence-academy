"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { TestimonialCard } from "@/components/marketing/cards";
import { useTestimonialsQuery } from "@/queries/testimonials.queries";
import type { TestimonialItem } from "@/types";

export function Testimonials({
  initialTestimonials,
}: {
  initialTestimonials?: TestimonialItem[];
}) {
  const { data: testimonials } = useTestimonialsQuery();
  const currentTestimonials = testimonials ?? initialTestimonials;

  const list =
    currentTestimonials && currentTestimonials.length > 0
      ? currentTestimonials
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

  const [i, setI] = useState(0);
  const n = list.length || 1;

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(id);
  }, [n]);

  if (list.length === 0) return null;

  const visible = [
    list[i % n],
    list[(i + 1) % n],
    list[(i + 2) % n],
  ].filter(Boolean);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Voices from the front"
          title="From classroom to commission"
          description="Stories from cadets and officers who began their journey at Afrin Defence Academy."
        />
        <div className="relative mt-14">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((t, idx) => (
                <motion.div
                  key={t.id + i + idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={
                    idx === 2
                      ? "hidden lg:block"
                      : idx === 1
                      ? "hidden md:block"
                      : ""
                  }
                >
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {n > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setI((v) => (v - 1 + n) % n)}
                aria-label="Previous"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {list.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === i ? "w-6 bg-accent" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setI((v) => (v + 1) % n)}
                aria-label="Next"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

