import { SectionHeading } from "../custom/section-heading";
import { GalleryGrid } from "./gallery-grid";


export default function LifeAtAfrin() {

    const fallback = [
        { src: "/assets/gallery-classroom.jpg", alt: "Cadets in classroom", caption: "Strategy & GS classroom" },
        { src: "/assets/gallery-pt.jpg", alt: "Cadets PT", caption: "Morning physical training" },
        { src: "/assets/gallery-graduation.jpg", alt: "Graduation", caption: "Commissioning ceremony" },
        { src: "/assets/gallery-navy.jpg", alt: "Navy ship", caption: "Naval Academy alumni" },
    ];

    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <SectionHeading eyebrow="Inside the academy" title="Life at Afrin" description="Discipline, camaraderie and a campus built for officer training." />
                <div className="mt-12"><GalleryGrid items={fallback} /></div>
            </div>
        </section>
    )
}
