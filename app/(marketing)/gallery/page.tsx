"use client";

import { useMemo } from "react";
import { CTASection } from "@/components/marketing/cta-section";
import { GalleryGrid } from "@/components/marketing/sections/gallery-grid";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { useGalleryQuery } from "@/queries/gallery.queries";
import type { GalleryItem } from "@/types";

const FALLBACK: GalleryItem[] = [
  {
    src: "/assets/hero-cadets.jpg",
    alt: "Cadets on parade",
    caption: "Annual passing-out parade",
  },
  {
    src: "/assets/gallery-classroom.jpg",
    alt: "Cadets in strategy class",
    caption: "Map briefing & GS class",
  },
  {
    src: "/assets/gallery-pt.jpg",
    alt: "Cadets PT",
    caption: "Dawn PT on the field",
  },
  {
    src: "/assets/gallery-graduation.jpg",
    alt: "Graduation",
    caption: "Commissioning ceremony",
  },
  {
    src: "/assets/gallery-navy.jpg",
    alt: "Naval alumni",
    caption: "Naval Academy alumni at sea",
  },
  {
    src: "/assets/cta-training.jpg",
    alt: "Cadets running",
    caption: "Endurance training",
  },
  {
    src: "/assets/gallery-pt.jpg",
    alt: "Push-ups",
    caption: "Strength block",
  },
  {
    src: "/assets/gallery-classroom.jpg",
    alt: "Briefing",
    caption: "Officer-led briefing",
  },
];

export default function GalleryPage() {
  const { data: galleryData } = useGalleryQuery();

  const items: GalleryItem[] = useMemo(() => {
    if (galleryData && galleryData.length > 0) {
      const activeItems = galleryData.filter((item) => item.active !== false);
      if (activeItems.length > 0) {
        return activeItems
          .sort((a, b) => a.order - b.order)
          .map((img) => ({
            src: img.src,
            alt: img.alt || "Life at Afrin Defence Academy",
            caption: img.caption || "",
          }));
      }
    }

    return FALLBACK;
  }, [galleryData]);

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Inside Afrin Defence Academy"
        description="Life on campus: drill fields, obstacle courses, strategy rooms, and commissioning day."
      />
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <GalleryGrid items={items} />
        </div>
      </section>
      <CTASection />
    </>
  );
}
