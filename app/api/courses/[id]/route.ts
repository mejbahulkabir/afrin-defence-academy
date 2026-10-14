import { NextRequest } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { courses } from "@/database/app-schema";
import { patchCourseSchema } from "@/validations/courses.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return ApiResponse.badRequest("Invalid ID parameter.");
    }

    const [item] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Course not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching course:", error);
    return ApiResponse.internalServerError("Failed to fetch course.");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return ApiResponse.badRequest("Invalid ID parameter.");
    }

    const [existing] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Course not found.");
    }

    const body: unknown = await request.json();
    const result = patchCourseSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    // Check slug uniqueness if slug is being changed
    if (result.data.slug && result.data.slug !== existing.slug) {
      const [duplicateSlug] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.slug, result.data.slug), ne(courses.id, numId)))
        .limit(1);

      if (duplicateSlug) {
        return ApiResponse.conflict("A course with this slug already exists.");
      }
    }

    const updates = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db
      .update(courses)
      .set(updates)
      .where(eq(courses.id, numId));

    const [updatedItem] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating course:", error);
    return ApiResponse.internalServerError("Failed to update course.");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return ApiResponse.badRequest("Invalid ID parameter.");
    }

    const [existing] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Course not found.");
    }

    await db.delete(courses).where(eq(courses.id, numId));

    return ApiResponse.okMessage("Course deleted successfully.");
  } catch (error) {
    console.error("Error deleting course:", error);
    return ApiResponse.internalServerError("Failed to delete course.");
  }
}
