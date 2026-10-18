import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { promises as fs } from "node:fs";
import path from "node:path";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { galleryImages } from "@/database/app-schema";
import { patchGallerySchema } from "@/validations/gallery.schema";

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
      .from(galleryImages)
      .where(eq(galleryImages.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Gallery image not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return ApiResponse.internalServerError("Failed to fetch gallery image.");
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
      .from(galleryImages)
      .where(eq(galleryImages.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Gallery image not found.");
    }

    const body: unknown = await request.json();
    const result = patchGallerySchema.safeParse(body);

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
      .update(galleryImages)
      .set(updates)
      .where(eq(galleryImages.id, numId));

    const [updatedItem] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return ApiResponse.internalServerError("Failed to update gallery image.");
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
      .from(galleryImages)
      .where(eq(galleryImages.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Gallery image not found.");
    }

    // Delete record from database
    await db.delete(galleryImages).where(eq(galleryImages.id, numId));

    // If image was stored locally in /storage/gallery/, remove the physical file
    if (existing.src && existing.src.startsWith("/storage/gallery/")) {
      const filePath = path.join(process.cwd(), "public", existing.src);
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore file missing errors
      }
    }

    return ApiResponse.okMessage("Gallery image deleted successfully.");
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return ApiResponse.internalServerError("Failed to delete gallery image.");
  }
}
