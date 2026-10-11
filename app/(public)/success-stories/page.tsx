import { CTASection } from "@/components/custom/cta-section";
import { PageHeader } from "@/components/sections/page-header";
import { StatsBand } from "@/components/sections/stats";
import SuccessStories from "@/components/sections/success-stories";


export default function SuccessStoriesPage() {
  return (
    <>
      <PageHeader eyebrow="Results" title="3,200+ officers. One academy." description="The numbers tell one story. The voices tell another." />
      <StatsBand />
      <SuccessStories />
      <CTASection />
    </>
  )
}
