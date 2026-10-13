
"use client";

import { motion } from "motion/react";
export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="bg-gradient-ocean relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />
      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          {eyebrow && (<span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--teal-soft)] backdrop-blur">{eyebrow}</span>)}
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">{description}</p>}
        </motion.div>
      </div>
    </section>
  );
}
