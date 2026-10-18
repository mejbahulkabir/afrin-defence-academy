import { NextRequest } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { exams } from "@/database/app-schema";
import { patchExamSchema } from "@/validations/exams.schema";

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
      .from(exams)
      .where(eq(exams.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Exam not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching exam:", error);
    return ApiResponse.internalServerError("Failed to fetch exam.");
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
      .from(exams)
      .where(eq(exams.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Exam not found.");
    }

    const body: unknown = await request.json();
    const result = patchExamSchema.safeParse(body);

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
        .from(exams)
        .where(and(eq(exams.slug, result.data.slug), ne(exams.id, numId)))
        .limit(1);

      if (duplicateSlug) {
        return ApiResponse.conflict("An exam with this slug already exists.");
      }
    }

    const updates = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db
      .update(exams)
      .set(updates)
      .where(eq(exams.id, numId));

    const [updatedItem] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating exam:", error);
    return ApiResponse.internalServerError("Failed to update exam.");
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
      .from(exams)
      .where(eq(exams.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Exam not found.");
    }

    await db.delete(exams).where(eq(exams.id, numId));

    return ApiResponse.okMessage("Exam deleted successfully.");
  } catch (error) {
    console.error("Error deleting exam:", error);
    return ApiResponse.internalServerError("Failed to delete exam.");
  }
}
