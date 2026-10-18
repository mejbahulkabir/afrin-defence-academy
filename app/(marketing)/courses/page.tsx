import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import CoursesSection from "@/components/marketing/sections/courses-section";
import { PageHeader } from "@/components/marketing/sections/page-header";
import {
  getBannersServer,
  getCoursesServer,
  getSiteSettingsServer,
} from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `Defence Coaching Programs & Courses | ${settings.name}`,
    description: `Explore officer entry programs for NDA, CDS, AFCAT, and SSB Interview preparation at ${settings.name}. Comprehensive written & SSB coaching.`,
    openGraph: {
      title: `Defence Coaching Programs | ${settings.name}`,
      description: `Explore officer entry programs for NDA, CDS, AFCAT, and SSB Interview preparation at ${settings.name}.`,
    },
  };
}

export const instant = false;

export default async function CoursesPage() {
  const [courses, settings, ctaBanners] = await Promise.all([
    getCoursesServer(),
    getSiteSettingsServer(),
    getBannersServer("cta"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Choose your training track"
        description="Comprehensive officer coaching programs covering NDA, CDS, AFCAT, SSB, and CAPF entries into the Indian Armed Forces."
      />
      <CoursesSection initialCourses={courses} />
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}
