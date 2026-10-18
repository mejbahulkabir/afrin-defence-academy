import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { faculty } from "@/database/app-schema";
import { patchFacultySchema } from "@/validations/faculty.schema";

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
      .from(faculty)
      .where(eq(faculty.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Faculty member not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching faculty member:", error);
    return ApiResponse.internalServerError("Failed to fetch faculty member.");
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
      .from(faculty)
      .where(eq(faculty.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Faculty member not found.");
    }

    const body: unknown = await request.json();
    const result = patchFacultySchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const updates = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db
      .update(faculty)
      .set(updates)
      .where(eq(faculty.id, numId));

    const [updatedItem] = await db
      .select()
      .from(faculty)
      .where(eq(faculty.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating faculty member:", error);
    return ApiResponse.internalServerError("Failed to update faculty member.");
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
      .from(faculty)
      .where(eq(faculty.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Faculty member not found.");
    }

    await db.delete(faculty).where(eq(faculty.id, numId));

    return ApiResponse.okMessage("Faculty member deleted successfully.");
  } catch (error) {
    console.error("Error deleting faculty member:", error);
    return ApiResponse.internalServerError("Failed to delete faculty member.");
  }
}
