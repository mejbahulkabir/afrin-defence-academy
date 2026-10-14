import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { courses } from "@/database/app-schema";
import { courseSchema } from "@/validations/courses.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(courses)
      .orderBy(asc(courses.order), desc(courses.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return ApiResponse.internalServerError("Failed to fetch courses.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return ApiResponse.unauthorized();
    }

    if (!["owner", "admin"].includes(session.user.role ?? "")) {
      return ApiResponse.forbidden();
    }

    const body: unknown = await request.json();
    const result = courseSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;

    // Check slug uniqueness
    const [existingSlug] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, values.slug))
      .limit(1);

    if (existingSlug) {
      return ApiResponse.conflict("A course with this slug already exists.");
    }

    const [inserted] = await db.insert(courses).values({
      slug: values.slug,
      title: values.title,
      duration: values.duration ?? null,
      mode: values.mode,
      level: values.level,
      description: values.description ?? null,
      features: values.features,
      popular: values.popular ?? false,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating course:", error);
    return ApiResponse.internalServerError("Failed to create course.");
  }
}
