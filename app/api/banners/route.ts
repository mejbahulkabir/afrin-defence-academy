import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { banners } from "@/database/app-schema";
import { bannerSchema } from "@/validations/banners.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slotParam = searchParams.get("slot");

    let query = db.select().from(banners);

    if (slotParam === "hero" || slotParam === "cta") {
      const items = await query
        .where(eq(banners.slot, slotParam))
        .orderBy(asc(banners.order), desc(banners.createdAt));
      return ApiResponse.ok(items);
    }

    const items = await query.orderBy(asc(banners.order), desc(banners.createdAt));
    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return ApiResponse.internalServerError("Failed to fetch banners.");
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
    const result = bannerSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;

    const [inserted] = await db.insert(banners).values({
      slot: values.slot,
      image: values.image,
      eyebrow: values.eyebrow ?? null,
      title: values.title ?? null,
      titleHighlight: values.titleHighlight ?? null,
      subtitle: values.subtitle ?? null,
      ctaLabel: values.ctaLabel ?? null,
      ctaHref: values.ctaHref ?? null,
      secondaryLabel: values.secondaryLabel ?? null,
      secondaryHref: values.secondaryHref ?? null,
      active: values.active ?? true,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(banners)
        .where(eq(banners.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating banner:", error);
    return ApiResponse.internalServerError("Failed to create banner.");
  }
}
