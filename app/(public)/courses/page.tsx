import { CTASection } from "@/components/custom/cta-section";
import CoursesSection from "@/components/sections/courses-section";
import { PageHeader } from "@/components/sections/page-header";

export default function CoursesPage() {
  return (
     <>
      <PageHeader eyebrow="Programs" title="Choose your training track" description="Six specialised programs covering every officer entry into the Indian Armed Forces and CAPF." />
      <CoursesSection />
      <CTASection />
    </>
  )
}
