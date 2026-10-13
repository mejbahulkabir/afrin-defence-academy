import { CTASection } from "@/components/marketing/cta-section";
import DefenceExams from "@/components/marketing/sections/defence-exams";
import { ExamCategories } from "@/components/marketing/sections/exam-categories";
import { PageHeader } from "@/components/marketing/sections/page-header";

export default function DefenceExamsPage() {
  return (
    <>
      <PageHeader eyebrow="Defence Exam Preparation" title="Every officer entry, decoded." description="Eligibility, structure and our approach to each major defence examination." />
      <ExamCategories />
      <DefenceExams />
      <CTASection />
    </>
  )
}
