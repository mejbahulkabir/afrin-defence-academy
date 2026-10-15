"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { stagger } from "@/components/animations/variants";
import { useStatsQuery } from "@/queries/stats.queries";

export function StatsBand() {
  const { data: stats } = useStatsQuery();

  const list =
    stats && stats.length > 0
      ? stats
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            id: s.id,
            label: s.label,
            value: s.value,
            suffix: s.suffix,
          }))
      : [];

  if (list.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/40 py-14 md:py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="container mx-auto grid grid-cols-2 gap-y-10 px-4 md:grid-cols-4"
      >
        {list.map((s) => (
          <AnimatedCounter
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
          />
        ))}
      </motion.div>
    </section>
  );
}