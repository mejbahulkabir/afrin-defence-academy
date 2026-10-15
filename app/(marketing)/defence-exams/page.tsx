import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import DefenceExams from "@/components/marketing/sections/defence-exams";
import { ExamCategories } from "@/components/marketing/sections/exam-categories";
import { PageHeader } from "@/components/marketing/sections/page-header";
import {
  getBannersServer,
  getExamsServer,
  getSiteSettingsServer,
} from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `Defence Examinations Guide (NDA, CDS, AFCAT, SSB) | ${settings.name}`,
    description: `Complete guide to Indian Armed Forces officer entries: NDA, CDS, AFCAT, CAPF, and SSB Interview. Eligibility, pattern, and preparation syllabus.`,
    openGraph: {
      title: `Defence Examinations Guide | ${settings.name}`,
      description: `Complete guide to Indian Armed Forces officer entries: NDA, CDS, AFCAT, and SSB.`,
    },
  };
}

export const instant = false;

export default async function DefenceExamsPage() {
  const [exams, settings, ctaBanners] = await Promise.all([
    getExamsServer(),
    getSiteSettingsServer(),
    getBannersServer("cta"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Defence Exam Preparation"
        title="Every officer entry, decoded."
        description="Eligibility, structure and our approach to each major defence examination."
      />
      <ExamCategories initialExams={exams} />
      <DefenceExams initialExams={exams} />
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}
