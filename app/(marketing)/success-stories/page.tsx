import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { StatsBand } from "@/components/marketing/sections/stats";
import SuccessStories from "@/components/marketing/sections/success-stories";
import {
  getBannersServer,
  getSiteSettingsServer,
  getStatsServer,
  getTestimonialsServer,
} from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `Officer Selections & Success Stories | ${settings.name}`,
    description: `Read real testimonials and verified success stories of candidates commissioned into the Indian Army, Navy, and Air Force through ${settings.name}.`,
    openGraph: {
      title: `Officer Selections & Success Stories | ${settings.name}`,
      description: `Read verified officer selections and cadet testimonials from ${settings.name}.`,
    },
  };
}

export const instant = false;

export default async function SuccessStoriesPage() {
  const [stats, testimonials, settings, ctaBanners] = await Promise.all([
    getStatsServer(),
    getTestimonialsServer(),
    getSiteSettingsServer(),
    getBannersServer("cta"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Results"
        title="3,200+ officers. One academy."
        description="The numbers tell one story. The voices tell another."
      />
      <StatsBand initialStats={stats} />
      <SuccessStories initialTestimonials={testimonials} />
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}
