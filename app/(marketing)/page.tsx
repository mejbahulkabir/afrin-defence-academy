import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import { ExamCategories } from "@/components/marketing/sections/exam-categories";
import { FacultyPreview } from "@/components/marketing/sections/faculty-preview";
import { Hero } from "@/components/marketing/sections/hero";
import LatestBlogs from "@/components/marketing/sections/latest-blogs";
import LifeAtAfrin from "@/components/marketing/sections/life-at-afrin";
import { PopularCourses } from "@/components/marketing/sections/popular-courses";
import { StatsBand } from "@/components/marketing/sections/stats";
import { Testimonials } from "@/components/marketing/sections/testimonials";
import { WhyUs } from "@/components/marketing/sections/why-us";
import {
  getBannersServer,
  getBlogsServer,
  getCoursesServer,
  getExamsServer,
  getFacultyServer,
  getGalleryServer,
  getSiteSettingsServer,
  getStatsServer,
  getTestimonialsServer,
  getWhyUsServer,
} from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `${settings.name} | ${settings.tagline}`,
    description: settings.description,
    openGraph: {
      title: `${settings.name} — Premier Officer Training Academy`,
      description: settings.description,
      type: "website",
    },
  };
}

export const instant = false;

export default async function HomePage() {
  const [
    settings,
    heroBanners,
    ctaBanners,
    stats,
    whyUs,
    courses,
    exams,
    faculty,
    testimonials,
    gallery,
    blogs,
  ] = await Promise.all([
    getSiteSettingsServer(),
    getBannersServer("hero"),
    getBannersServer("cta"),
    getStatsServer(),
    getWhyUsServer(),
    getCoursesServer(),
    getExamsServer(),
    getFacultyServer(),
    getTestimonialsServer(),
    getGalleryServer(),
    getBlogsServer(3),
  ]);

  return (
    <>
      <Hero initialBanners={heroBanners} initialSettings={settings} />
      <StatsBand initialStats={stats} />
      <WhyUs initialWhyUs={whyUs} />
      <PopularCourses initialCourses={courses} />
      <ExamCategories initialExams={exams} />
      <FacultyPreview initialFaculty={faculty} />
      <Testimonials initialTestimonials={testimonials} />
      <LifeAtAfrin initialGallery={gallery} />
      <LatestBlogs initialPosts={blogs} />
      <CTASection initialSettings={settings} initialBanners={ctaBanners} />
    </>
  );
}