"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { fadeUp, stagger } from "@/components/animations/variants";
import { useWhyUsQuery } from "@/queries/why-us.queries";

export function WhyUs() {
  const { data: whyUs } = useWhyUsQuery();

  const list =
    whyUs && whyUs.length > 0
      ? whyUs
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((w) => ({
            id: w.id,
            title: w.title,
            desc: w.desc,
          }))
      : [];

  if (list.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Why Afrin"
          title="Discipline. Mentorship. Results."
          description="Everything the army-style intensity demands, structured into a coaching system that actually works."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((w) => (
            <motion.div
              key={w.title}
              variants={fadeUp}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-elegant"
            >
              <CheckCircle2 className="h-7 w-7 text-accent" />
              <h3 className="font-display mt-4 text-lg font-semibold text-foreground">
                {w.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

