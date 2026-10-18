import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { galleryImages } from "@/database/app-schema";
import { gallerySchema } from "@/validations/gallery.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.order), desc(galleryImages.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return ApiResponse.internalServerError("Failed to fetch gallery images.");
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

    if (!["owner", "admin", "publisher"].includes(session.user.role ?? "")) {
      return ApiResponse.forbidden();
    }

    const body: unknown = await request.json();
    const result = gallerySchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;

    const [inserted] = await db.insert(galleryImages).values({
      src: values.src,
      alt: values.alt ?? null,
      caption: values.caption ?? null,
      active: values.active ?? true,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return ApiResponse.internalServerError("Failed to create gallery image.");
  }
}
