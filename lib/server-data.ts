import { asc, desc, eq, and } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {
  courses,
  faculty,
  exams,
  whyUs,
  stats,
  testimonials,
  galleryImages,
  blogPosts,
  banners,
  siteSettings,
} from "@/database/app-schema";
import { SITE } from "@/constants/site";
import type {
  CourseItem,
  FacultyItem,
  ExamItem,
  WhyUsItem,
  StatItem,
  TestimonialItem,
  GalleryImageItem,
  BlogPostItem,
  BannerItem,
  SiteSettings,
} from "@/types";

export async function getSiteSettingsServer(): Promise<SiteSettings> {
  try {
    const [settings] = await db.select().from(siteSettings).limit(1);
    if (!settings) {
      return {
        name: SITE.name,
        shortName: SITE.shortName,
        tagline: SITE.tagline,
        description: SITE.description,
        phone: SITE.phone,
        phoneRaw: SITE.phoneRaw,
        email: SITE.email,
        whatsapp: SITE.whatsapp,
        address: SITE.address,
        mapsEmbed: SITE.mapsEmbed,
        socials: { ...SITE.socials },
      };
    }
    return {
      name: settings.name || SITE.name,
      shortName: settings.shortName || SITE.shortName,
      tagline: settings.tagline || SITE.tagline,
      description: settings.description || SITE.description,
      phone: settings.phone || SITE.phone,
      phoneRaw: settings.phoneRaw || settings.phone || SITE.phoneRaw,
      email: settings.email || SITE.email,
      whatsapp: settings.whatsapp || SITE.whatsapp,
      address: settings.address || SITE.address,
      mapsEmbed: settings.mapsEmbed || SITE.mapsEmbed,
      socials: (settings.socials as Record<string, string>) || { ...SITE.socials },
    };
  } catch (error) {
    console.error("Error fetching site settings server-side:", error);
    return {
      name: SITE.name,
      shortName: SITE.shortName,
      tagline: SITE.tagline,
      description: SITE.description,
      phone: SITE.phone,
      phoneRaw: SITE.phoneRaw,
      email: SITE.email,
      whatsapp: SITE.whatsapp,
      address: SITE.address,
      mapsEmbed: SITE.mapsEmbed,
      socials: { ...SITE.socials },
    };
  }
}

export async function getCoursesServer(): Promise<CourseItem[]> {
  try {
    const items = await db
      .select()
      .from(courses)
      .orderBy(asc(courses.order), desc(courses.createdAt));
    return items as CourseItem[];
  } catch (error) {
    console.error("Error fetching courses server-side:", error);
    return [];
  }
}

export async function getFacultyServer(): Promise<FacultyItem[]> {
  try {
    const items = await db
      .select()
      .from(faculty)
      .orderBy(asc(faculty.order), desc(faculty.createdAt));
    return items as FacultyItem[];
  } catch (error) {
    console.error("Error fetching faculty server-side:", error);
    return [];
  }
}

export async function getExamsServer(): Promise<ExamItem[]> {
  try {
    const items = await db
      .select()
      .from(exams)
      .orderBy(asc(exams.order), desc(exams.createdAt));
    return items as ExamItem[];
  } catch (error) {
    console.error("Error fetching exams server-side:", error);
    return [];
  }
}

export async function getWhyUsServer(): Promise<WhyUsItem[]> {
  try {
    const items = await db
      .select()
      .from(whyUs)
      .orderBy(asc(whyUs.order), desc(whyUs.createdAt));
    return items as WhyUsItem[];
  } catch (error) {
    console.error("Error fetching why-us server-side:", error);
    return [];
  }
}

export async function getStatsServer(): Promise<StatItem[]> {
  try {
    const items = await db
      .select()
      .from(stats)
      .orderBy(asc(stats.order), desc(stats.createdAt));
    return items as StatItem[];
  } catch (error) {
    console.error("Error fetching stats server-side:", error);
    return [];
  }
}

export async function getTestimonialsServer(): Promise<TestimonialItem[]> {
  try {
    const items = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.order), desc(testimonials.createdAt));
    return items as TestimonialItem[];
  } catch (error) {
    console.error("Error fetching testimonials server-side:", error);
    return [];
  }
}

export async function getGalleryServer(): Promise<GalleryImageItem[]> {
  try {
    const items = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.active, true))
      .orderBy(asc(galleryImages.order), desc(galleryImages.createdAt));
    return items as GalleryImageItem[];
  } catch (error) {
    console.error("Error fetching gallery server-side:", error);
    return [];
  }
}

export async function getBlogsServer(limit?: number): Promise<BlogPostItem[]> {
  try {
    const query = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));

    if (limit) {
      const items = await query.limit(limit);
      return items as BlogPostItem[];
    }
    const items = await query;
    return items as BlogPostItem[];
  } catch (error) {
    console.error("Error fetching blogs server-side:", error);
    return [];
  }
}

export async function getBlogBySlugServer(
  slug: string,
): Promise<BlogPostItem | null> {
  try {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1);
    return (post as BlogPostItem) ?? null;
  } catch (error) {
    console.error("Error fetching blog by slug server-side:", error);
    return null;
  }
}

export async function getBannersServer(
  slot: "hero" | "cta",
): Promise<BannerItem[]> {
  try {
    const items = await db
      .select()
      .from(banners)
      .where(and(eq(banners.slot, slot), eq(banners.active, true)))
      .orderBy(asc(banners.order), desc(banners.createdAt));
    return items as BannerItem[];
  } catch (error) {
    console.error(`Error fetching banners (${slot}) server-side:`, error);
    return [];
  }
}
