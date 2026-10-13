"use client";

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



export default function HomePage() {
  
  return (
    <>
      <Hero />
      <StatsBand />
      <WhyUs />
      <PopularCourses />
      <ExamCategories />
      <FacultyPreview />
      <Testimonials />
      <LifeAtAfrin />
      <LatestBlogs />
      <CTASection />
    </>
  );
}