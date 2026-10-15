import type { Metadata } from "next";
import AllBlogs from "@/components/marketing/sections/all-blogs";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { getBlogsServer, getSiteSettingsServer } from "@/lib/server-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  return {
    title: `Defence Exam Preparation Articles & Insights | ${settings.name}`,
    description: `Read defence exam preparation strategies, syllabus analysis, current affairs, and SSB Interview guidance written by veteran faculty at ${settings.name}.`,
    openGraph: {
      title: `Defence Articles & Insights | ${settings.name}`,
      description: `Read defence exam strategies and SSB interview insights from ${settings.name}.`,
    },
  };
}

export const instant = false;

export default async function BlogPage() {
  const [blogs] = await Promise.all([
    getBlogsServer(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Strategy & service writing"
        description="Long-form articles from our faculty — practical, specific and based on what actually works."
      />
      <AllBlogs initialPosts={blogs} />
    </>
  );
}
