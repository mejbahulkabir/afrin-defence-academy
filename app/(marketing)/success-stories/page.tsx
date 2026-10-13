import { CTASection } from "@/components/marketing/cta-section";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { StatsBand } from "@/components/marketing/sections/stats";
import SuccessStories from "@/components/marketing/sections/success-stories";


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
