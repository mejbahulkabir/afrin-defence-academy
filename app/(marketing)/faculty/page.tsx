import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import AcademyFaculties from "@/components/marketing/sections/academy-faculties";
import { PageHeader } from "@/components/marketing/sections/page-header";
import {
  getBannersServer,
  getFacultyServer,
  getSiteSettingsServer,
} from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `Our Faculty & Officer Mentors | ${settings.name}`,
    description: `Meet the distinguished faculty and retired defence officers who train and mentor candidates at ${settings.name}. Decades of service distilled into coaching.`,
    openGraph: {
      title: `Our Faculty & Mentors | ${settings.name}`,
      description: `Meet our veteran officer faculty and defence mentors at ${settings.name}.`,
    },
  };
}

export const instant = false;

export default async function FacultyPage() {
  const [faculty, settings, ctaBanners] = await Promise.all([
    getFacultyServer(),
    getSiteSettingsServer(),
    getBannersServer("cta"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="The mentors"
        title="Faculty who have served, and now teach."
        description="Operational experience meets pedagogy."
      />
      <AcademyFaculties initialFaculty={faculty} />
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}
