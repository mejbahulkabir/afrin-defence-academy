"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/custom/section-heading";
import { TestimonialCard } from "@/components/custom/cards";
import { TESTIMONIALS } from "@/constants/data";

export function Testimonials() {
  const [i, setI] = useState(0);
  const n = TESTIMONIALS.length;
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % n), 6000); return () => clearInterval(id); }, [n]);
  const visible = [TESTIMONIALS[i % n], TESTIMONIALS[(i + 1) % n], TESTIMONIALS[(i + 2) % n]];
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Voices from the front" title="From classroom to commission" description="Stories from cadets and officers who began their journey at Afrin Defence Academy." />
        <div className="relative mt-14">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((t, idx) => (
                <motion.div key={t.id + i + idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, delay: idx * 0.05 }} className={idx === 2 ? "hidden lg:block" : idx === 1 ? "hidden md:block" : ""}>
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={() => setI((v) => (v - 1 + n) % n)} aria-label="Previous" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex gap-1.5">{TESTIMONIALS.map((_, idx) => (<button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-accent" : "w-1.5 bg-border"}`} />))}</div>
            <button onClick={() => setI((v) => (v + 1) % n)} aria-label="Next" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
