"use client";

import { SectionHeading } from "../section-heading";
import { GalleryGrid } from "./gallery-grid";
import { useGalleryQuery } from "@/queries/gallery.queries";
import type { GalleryImageItem } from "@/types";

const FALLBACK = [
  {
    src: "/assets/gallery-classroom.jpg",
    alt: "Cadets in classroom",
    caption: "Strategy & GS classroom",
  },
  {
    src: "/assets/gallery-pt.jpg",
    alt: "Cadets PT",
    caption: "Morning physical training",
  },
  {
    src: "/assets/gallery-graduation.jpg",
    alt: "Graduation",
    caption: "Commissioning ceremony",
  },
  {
    src: "/assets/gallery-navy.jpg",
    alt: "Navy ship",
    caption: "Naval Academy alumni",
  },
];

export default function LifeAtAfrin({
  initialGallery,
}: {
  initialGallery?: GalleryImageItem[];
}) {
  const { data: galleryImages } = useGalleryQuery();
  const currentGallery = galleryImages ?? initialGallery;

  const items =
    currentGallery && currentGallery.length > 0
      ? currentGallery
          .filter((img) => img.active !== false)
          .sort((a, b) => a.order - b.order)
          .slice(0, 8)
          .map((img) => ({
            src: img.src,
            alt: img.alt || "Life at Afrin Defence Academy",
            caption: img.caption || "",
          }))
      : FALLBACK;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Inside the academy"
          title="Life at Afrin"
          description="Discipline, camaraderie and a campus built for officer training."
        />
        <div className="mt-12">
          <GalleryGrid items={items.length > 0 ? items : FALLBACK} />
        </div>
      </div>
    </section>
  );
}

