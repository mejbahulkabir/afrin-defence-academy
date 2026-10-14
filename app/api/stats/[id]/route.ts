import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { stats } from "@/database/app-schema";
import { patchStatSchema } from "@/validations/stats.schema";

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
      .from(stats)
      .where(eq(stats.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Stat not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching stat:", error);
    return ApiResponse.internalServerError("Failed to fetch stat.");
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
      .from(stats)
      .where(eq(stats.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Stat not found.");
    }

    const body: unknown = await request.json();
    const result = patchStatSchema.safeParse(body);

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
      .update(stats)
      .set(updates)
      .where(eq(stats.id, numId));

    const [updatedItem] = await db
      .select()
      .from(stats)
      .where(eq(stats.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating stat:", error);
    return ApiResponse.internalServerError("Failed to update stat.");
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
      .from(stats)
      .where(eq(stats.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Stat not found.");
    }

    await db.delete(stats).where(eq(stats.id, numId));

    return ApiResponse.okMessage("Stat deleted successfully.");
  } catch (error) {
    console.error("Error deleting stat:", error);
    return ApiResponse.internalServerError("Failed to delete stat.");
  }
}
