import { CTASection } from "@/components/custom/cta-section";
import AcademyFaculties from "@/components/sections/academy-faculties";
import { PageHeader } from "@/components/sections/page-header";


export default function FacultyPage() {
  return (
    <>
      <PageHeader eyebrow="The mentors" title="Faculty who have served, and now teach." description="Operational experience meets pedagogy." />
      <AcademyFaculties />
      <CTASection />
    </>
  )
}
