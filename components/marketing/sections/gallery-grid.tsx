"use client";

import { motion } from "motion/react";
import { fadeUp, stagger } from "@/components/animations/variants";
import type { GalleryItem } from "@/types";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {items.map((g, i) => (
        <motion.figure key={i} variants={fadeUp} className={`group relative overflow-hidden rounded-2xl ${i % 5 === 0 ? "col-span-2 row-span-2" : ""}`}>
          <img src={g.src} alt={g.alt ?? ""} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/85 via-[var(--navy-deep)]/0 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 md:p-4">{g.caption ?? ""}</figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}
