import { CTASection } from "@/components/marketing/cta-section";
import CoursesSection from "@/components/marketing/sections/courses-section";
import { PageHeader } from "@/components/marketing/sections/page-header";

export default function CoursesPage() {
  return (
     <>
      <PageHeader eyebrow="Programs" title="Choose your training track" description="Six specialised programs covering every officer entry into the Indian Armed Forces and CAPF." />
      <CoursesSection />
      <CTASection />
    </>
  )
}
