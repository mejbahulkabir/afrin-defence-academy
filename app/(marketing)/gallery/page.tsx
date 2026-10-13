import { CTASection } from "@/components/marketing/cta-section";
import { GalleryGrid } from "@/components/marketing/sections/gallery-grid";
import { PageHeader } from "@/components/marketing/sections/page-header";


export default function GalleryPage() {
    const fallback = [
        { src: "/assets/hero-cadets.jpg", alt: "Cadets on parade", caption: "Annual passing-out parade" },
        { src: "/assets/gallery-classroom.jpg", alt: "Cadets in strategy class", caption: "Map briefing & GS class" },
        { src: "/assets/gallery-pt.jpg", alt: "Cadets PT", caption: "Dawn PT on the field" },
        { src: "/assets/gallery-graduation.jpg", alt: "Graduation", caption: "Commissioning ceremony" },
        { src: "/assets/gallery-navy.jpg", alt: "Naval alumni", caption: "Naval Academy alumni at sea" },
        { src: "/assets/cta-training.jpg", alt: "Cadets running", caption: "Endurance training" },
        { src: "/assets/gallery-pt.jpg", alt: "Push-ups", caption: "Strength block" },
        { src: "/assets/gallery-classroom.jpg", alt: "Briefing", caption: "Officer-led briefing" },
    ];
    return (
        <>
            <PageHeader eyebrow="Gallery" title="Inside Afrin Defence Academy" />
            <section className="py-20 md:py-24"><div className="container mx-auto px-4"><GalleryGrid items={fallback} /></div></section>
            <CTASection />
        </>
    )
}
