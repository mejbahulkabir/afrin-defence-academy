"use client";

import { motion } from "motion/react";
import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { useBannersQuery } from "@/queries/banners.queries";
import { useStatsQuery } from "@/queries/stats.queries";

const DEFAULTS = {
  image: "/assets/hero-cadets.jpg",
  eyebrow: "India's most decorated defence academy",
  title: "Become the officer",
  titleHighlight: "India is waiting for.",
  subtitle:
    "NDA · CDS · AFCAT · SSB · CAPF — taught by ex-defence officers, with a 97% SSB recommendation rate and three thousand commissioned alumni.",
  ctaLabel: "Apply for Admission",
  ctaHref: "/admission",
  secondaryLabel: "Explore Courses",
  secondaryHref: "/courses",
};

import type { BannerItem, SiteSettings, StatItem } from "@/types";

export function Hero({
  initialBanners,
  initialStats,
  initialSettings,
  settings,
}: {
  initialBanners?: BannerItem[];
  initialStats?: StatItem[];
  initialSettings?: SiteSettings | null;
  settings?: SiteSettings | null;
} = {}) {
  const { data: banners } = useBannersQuery("hero");
  const { data: stats } = useStatsQuery();

  const currentBanners = banners ?? initialBanners;
  const currentStats = stats ?? initialStats;

  const activeBanner =
    currentBanners?.find((b) => b.active) ?? currentBanners?.[0];

  const image = activeBanner?.image || DEFAULTS.image;
  const eyebrow = activeBanner?.eyebrow || DEFAULTS.eyebrow;
  const title = activeBanner?.title || DEFAULTS.title;
  const titleHighlight =
    activeBanner?.titleHighlight ?? DEFAULTS.titleHighlight;
  const subtitle = activeBanner?.subtitle || DEFAULTS.subtitle;
  const ctaLabel = activeBanner?.ctaLabel || DEFAULTS.ctaLabel;
  const ctaHref = activeBanner?.ctaHref || DEFAULTS.ctaHref;
  const secondaryLabel =
    activeBanner?.secondaryLabel ?? DEFAULTS.secondaryLabel;
  const secondaryHref = activeBanner?.secondaryHref ?? DEFAULTS.secondaryHref;

  const highlights =
    currentStats && currentStats.length >= 3
      ? currentStats
          .slice()
          .sort((a, b) => a.order - b.order)
          .slice(0, 3)
          .map((s) => [`${s.value.toLocaleString()}${s.suffix}`, s.label])
      : [
          ["3,200+", "Officers commissioned"],
          ["97%", "SSB recommendation"],
          ["18+", "Years of training"],
        ];

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt="Defence academy banner"
          width={1920}
          height={1080}
          unoptimized={image.startsWith("/storage") || image.startsWith("http")}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-deep)]/95 via-[var(--navy-deep)]/85 to-[var(--navy)]/60" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.07]" />
      </div>

      <div className="container relative mx-auto px-4 pb-20 pt-20 md:pb-32 md:pt-32 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--teal-soft)] backdrop-blur"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {title}
              {titleHighlight ? (
                <>
                  <br />
                  <span className="text-gradient-ocean">{titleHighlight}</span>
                </>
              ) : null}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-[var(--navy-deep)] hover:bg-white/90"
              >
                <a href={ctaHref}>
                  {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {secondaryLabel ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={secondaryHref}>
                    <PlayCircle className="mr-2 h-4 w-4" /> {secondaryLabel}
                  </a>
                </Button>
              ) : null}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6"
            >
              {highlights.map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-semibold text-white md:text-3xl">
                    {v}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/60">
                    {l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:col-span-5 lg:block"
          >
            <div className="glass shadow-elegant relative rounded-3xl p-7 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal-soft)]">
                Batch 2026 · Admissions Open
              </div>
              <h3 className="font-display mt-3 text-2xl font-semibold">
                Foundation, Crash & SSB programs
              </h3>
              <p className="mt-2 text-sm text-white/75">
                Choose from 6 specialised tracks. Limited to 30 cadets per
                batch.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Live + recorded classes by ex-defence faculty",
                  "On-campus SSB simulation with real GTO ground",
                  "Until-you-clear free repeat policy",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal-soft)]" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                href="/admission"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[var(--navy-deep)] transition-transform hover:scale-[1.02]"
              >
                Start your application <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
