import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import DisciplineMentorshipResults from "@/components/marketing/sections/discipline-entorship-results";
import OurMissionStory from "@/components/marketing/sections/our-mission-story";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { StatsBand } from "@/components/marketing/sections/stats";
import { WhyUs } from "@/components/marketing/sections/why-us";
import {
  getBannersServer,
  getSiteSettingsServer,
  getStatsServer,
  getWhyUsServer,
} from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `About ${settings.name} | Legacy of Defence Officer Coaching`,
    description: `Discover the story, mission, and officer-led faculty behind ${settings.name}. 18+ years of shaping cadets for the Indian Armed Forces.`,
    openGraph: {
      title: `About ${settings.name} — Legacy of Officer Coaching`,
      description: `18+ years of preparing cadets for the Indian Armed Forces with measurable, repeatable results.`,
    },
  };
}

export const instant = false;

export default async function AboutPage() {
  const [stats, whyUs, settings, ctaBanners] = await Promise.all([
    getStatsServer(),
    getWhyUsServer(),
    getSiteSettingsServer(),
    getBannersServer("cta"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About the Academy"
        title="Eighteen years of training India's officers"
        description="Founded in 2007 by serving and retired officers, Afrin Defence Academy has prepared over 12,500 aspirants for the Indian Armed Forces with measurable, repeatable results."
      />
      <OurMissionStory />
      <StatsBand initialStats={stats} />
      <DisciplineMentorshipResults />
      <WhyUs initialWhyUs={whyUs} />
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}
