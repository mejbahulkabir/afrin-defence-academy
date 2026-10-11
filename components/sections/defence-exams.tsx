"use client"

import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../animations/variants';
import { EXAMS } from '@/constants/data';

export default function DefenceExams() {
  return (
    <section className="bg-secondary/40 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-6 md:grid-cols-2">
            {EXAMS.map((e) => (
              <motion.div key={e.slug} variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{e.branch}</div>
                <h3 className="font-display mt-2 text-2xl font-semibold">{e.full}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
                <div className="mt-5 rounded-lg border border-border bg-background p-4 text-sm"><span className="font-semibold">Eligibility: </span>{e.eligibility}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  )
}
