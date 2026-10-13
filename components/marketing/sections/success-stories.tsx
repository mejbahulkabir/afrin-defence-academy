"use client";

import { stagger } from "@/components/animations/variants";
import { TESTIMONIALS } from "@/constants/data";
import { motion } from "motion/react";
import { TestimonialCard } from "../cards";

export default function SuccessStories() {
  return (
    <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (<TestimonialCard key={t.id} t={t} />))}
          </motion.div>
        </div>
      </section>
  )
}
