import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { promises as fs } from "node:fs";
import path from "node:path";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { banners } from "@/database/app-schema";
import { patchBannerSchema } from "@/validations/banners.schema";

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
      .from(banners)
      .where(eq(banners.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Banner not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return ApiResponse.internalServerError("Failed to fetch banner.");
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

    if (!["owner", "admin", "publisher"].includes(session.user.role ?? "")) {
      return ApiResponse.forbidden();
    }

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return ApiResponse.badRequest("Invalid ID parameter.");
    }

    const [existing] = await db
      .select()
      .from(banners)
      .where(eq(banners.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Banner not found.");
    }

    const body: unknown = await request.json();
    const result = patchBannerSchema.safeParse(body);

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

    await db.update(banners).set(updates).where(eq(banners.id, numId));

    const [updatedItem] = await db
      .select()
      .from(banners)
      .where(eq(banners.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating banner:", error);
    return ApiResponse.internalServerError("Failed to update banner.");
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

    if (!["owner", "admin", "publisher"].includes(session.user.role ?? "")) {
      return ApiResponse.forbidden();
    }

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return ApiResponse.badRequest("Invalid ID parameter.");
    }

    const [existing] = await db
      .select()
      .from(banners)
      .where(eq(banners.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Banner not found.");
    }

    await db.delete(banners).where(eq(banners.id, numId));

    // Clean up local storage image file if it exists
    if (existing.image && existing.image.startsWith("/storage/")) {
      const filePath = path.join(process.cwd(), "public", existing.image);
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore if file already missing
      }
    }

    return ApiResponse.okMessage("Banner deleted successfully.");
  } catch (error) {
    console.error("Error deleting banner:", error);
    return ApiResponse.internalServerError("Failed to delete banner.");
  }
}
