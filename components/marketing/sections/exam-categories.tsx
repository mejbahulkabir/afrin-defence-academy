"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Anchor,
  Plane,
  Shield,
  Crosshair,
  Compass,
  Flag,
} from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { fadeUp, stagger } from "@/components/animations/variants";
import { useExamsQuery } from "@/queries/exams.queries";
import Link from "next/link";

const ICONS: Record<string, typeof Shield> = {
  nda: Shield,
  "nda-na": Shield,
  cds: Crosshair,
  afcat: Plane,
  ssb: Compass,
  capf: Flag,
  agniveer: Anchor,
};

export function ExamCategories() {
  const { data: exams } = useExamsQuery();

  const list =
    exams && exams.length > 0
      ? exams
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((e) => ({
            id: e.id,
            slug: e.slug,
            name: e.name,
            full: e.full || e.name,
            branch: e.branch || "Armed Forces",
            description: e.description || "",
            eligibility: e.eligibility || "",
          }))
      : [];

  if (list.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Defence Exam Categories"
          title="Pick your path. We've trained officers for all of them."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((e) => {
            const Icon = ICONS[e.slug] ?? Shield;
            return (
              <motion.div key={e.slug} variants={fadeUp}>
                <Link
                  href="/defence-exams"
                  className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-elegant"
                >
                  <div className="bg-gradient-ocean flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {e.name}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                      {e.branch}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {e.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

