import { CTASection } from "@/components/marketing/cta-section";
import AcademyFaculties from "@/components/marketing/sections/academy-faculties";
import { PageHeader } from "@/components/marketing/sections/page-header";


export default function FacultyPage() {
  return (
    <>
      <PageHeader eyebrow="The mentors" title="Faculty who have served, and now teach." description="Operational experience meets pedagogy." />
      <AcademyFaculties />
      <CTASection />
    </>
  )
}
