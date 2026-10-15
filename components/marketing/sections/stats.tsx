"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { stagger } from "@/components/animations/variants";
import { useStatsQuery } from "@/queries/stats.queries";
import type { StatItem } from "@/types";

export function StatsBand({
  initialStats,
}: {
  initialStats?: StatItem[];
} = {}) {
  const { data: stats } = useStatsQuery();

  const currentStats = stats ?? initialStats;

  const list =
    currentStats && currentStats.length > 0
      ? currentStats
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