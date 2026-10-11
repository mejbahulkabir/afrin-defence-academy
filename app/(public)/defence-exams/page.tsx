import { CTASection } from "@/components/custom/cta-section";
import DefenceExams from "@/components/sections/defence-exams";
import { ExamCategories } from "@/components/sections/exam-categories";
import { PageHeader } from "@/components/sections/page-header";

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
