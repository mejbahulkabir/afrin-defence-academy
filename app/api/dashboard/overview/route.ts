import { NextRequest } from "next/server";
import { count, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import {
  admissionSubmissions,
  banners,
  blogPosts,
  contactSubmissions,
  courses,
  exams,
  faculty,
  galleryImages,
  testimonials,
} from "@/database/app-schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return ApiResponse.unauthorized();
    }

    if (!["owner", "admin", "publisher"].includes(session.user.role ?? "")) {
      return ApiResponse.forbidden();
    }

    const [
      coursesCountRes,
      examsCountRes,
      facultyCountRes,
      testimonialsCountRes,
      blogPostsCountRes,
      galleryImagesCountRes,
      bannersCountRes,
      contactCountRes,
      contactPendingRes,
      admissionCountRes,
      admissionPendingRes,
      recentContacts,
      recentAdmissions,
    ] = await Promise.all([
      db.select({ value: count() }).from(courses),
      db.select({ value: count() }).from(exams),
      db.select({ value: count() }).from(faculty),
      db.select({ value: count() }).from(testimonials),
      db.select({ value: count() }).from(blogPosts),
      db.select({ value: count() }).from(galleryImages),
      db.select({ value: count() }).from(banners),
      db.select({ value: count() }).from(contactSubmissions),
      db
        .select({ value: count() })
        .from(contactSubmissions)
        .where(eq(contactSubmissions.handled, false)),
      db.select({ value: count() }).from(admissionSubmissions),
      db
        .select({ value: count() })
        .from(admissionSubmissions)
        .where(eq(admissionSubmissions.handled, false)),
      db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(5),
      db
        .select()
        .from(admissionSubmissions)
        .orderBy(desc(admissionSubmissions.createdAt))
        .limit(5),
    ]);

    return ApiResponse.ok({
      counts: {
        courses: Number(coursesCountRes[0]?.value ?? 0),
        exams: Number(examsCountRes[0]?.value ?? 0),
        faculty: Number(facultyCountRes[0]?.value ?? 0),
        testimonials: Number(testimonialsCountRes[0]?.value ?? 0),
        blogPosts: Number(blogPostsCountRes[0]?.value ?? 0),
        galleryImages: Number(galleryImagesCountRes[0]?.value ?? 0),
        banners: Number(bannersCountRes[0]?.value ?? 0),
        contactSubmissions: Number(contactCountRes[0]?.value ?? 0),
        contactPending: Number(contactPendingRes[0]?.value ?? 0),
        admissionSubmissions: Number(admissionCountRes[0]?.value ?? 0),
        admissionPending: Number(admissionPendingRes[0]?.value ?? 0),
      },
      recentContacts,
      recentAdmissions,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview stats:", error);
    return ApiResponse.internalServerError(
      "Failed to fetch dashboard overview stats.",
    );
  }
}
