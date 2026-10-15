import { CTASection } from "@/components/marketing/cta-section";
import CoursesSection from "@/components/marketing/sections/courses-section";
import { PageHeader } from "@/components/marketing/sections/page-header";

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Choose your training track"
        description="Comprehensive officer coaching programs covering NDA, CDS, AFCAT, SSB, and CAPF entries into the Indian Armed Forces."
      />
      <CoursesSection />
      <CTASection />
    </>
  );
}
