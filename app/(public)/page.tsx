"use client";

import { CTASection } from "@/components/custom/cta-section";
import { ExamCategories } from "@/components/sections/exam-categories";
import { FacultyPreview } from "@/components/sections/faculty-preview";
import { Hero } from "@/components/sections/hero";
import LatestBlogs from "@/components/sections/latest-blogs";
import LifeAtAfrin from "@/components/sections/life-at-afrin";
import { PopularCourses } from "@/components/sections/popular-courses";
import { StatsBand } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyUs } from "@/components/sections/why-us";


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