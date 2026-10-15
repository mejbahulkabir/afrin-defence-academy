"use client";

import { motion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/constants/site";

import { useBannersQuery } from "@/queries/banners.queries";
import { useSiteSettingsQuery } from "@/queries/settings.queries";

const DEFAULTS = {
  image: "/assets/cta-training.jpg",
  eyebrow: "Admissions Open · Batch 2026",
  title: "Your shoulders deserve those stars.",
  subtitle:
    "Join 12,500+ aspirants who chose Afrin Defence Academy to take the disciplined route to a commissioned career.",
  ctaLabel: "Apply for Admission",
  ctaHref: "/admission",
};

import type { BannerItem, SiteSettings } from "@/types";

export function CTASection({
  initialBanners,
  initialSettings,
  settings: propSettings,
}: {
  initialBanners?: BannerItem[];
  initialSettings?: SiteSettings | null;
  settings?: SiteSettings | null;
} = {}) {
  const { data: ctaBanners } = useBannersQuery("cta");
  const { data: querySettings } = useSiteSettingsQuery();

  const currentSettings = querySettings ?? initialSettings ?? propSettings;
  const currentBanners = ctaBanners ?? initialBanners;

  const activeCta = currentBanners?.find((b) => b.active) ?? currentBanners?.[0];

  const image = activeCta?.image || DEFAULTS.image;
  const eyebrow = activeCta?.eyebrow || DEFAULTS.eyebrow;
  const title = activeCta?.title || DEFAULTS.title;
  const subtitle = activeCta?.subtitle || DEFAULTS.subtitle;
  const ctaLabel = activeCta?.ctaLabel || DEFAULTS.ctaLabel;
  const ctaHref = activeCta?.ctaHref || DEFAULTS.ctaHref;

  const phone = currentSettings?.phone || SITE.phone;
  const phoneRaw =
    currentSettings?.phoneRaw || currentSettings?.phone || SITE.phoneRaw;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)]/95 via-[var(--navy)]/85 to-[var(--navy-deep)]/70" />
      </div>
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <span
            className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--teal-soft)]"
            suppressHydrationWarning
          >
            {eyebrow}
          </span>
          <h2
            className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
            suppressHydrationWarning
          >
            {title}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg"
            suppressHydrationWarning
          >
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-[var(--navy-deep)] hover:bg-white/90"
            >
              <a href={ctaHref} suppressHydrationWarning>
                {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`tel:${phoneRaw ?? ""}`} suppressHydrationWarning>
                <Phone className="mr-2 h-4 w-4" /> {phone}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
