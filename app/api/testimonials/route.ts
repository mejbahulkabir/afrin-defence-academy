import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { testimonials } from "@/database/app-schema";
import { testimonialSchema } from "@/validations/testimonials.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.order), desc(testimonials.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return ApiResponse.internalServerError("Failed to fetch testimonials.");
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
    const result = testimonialSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;
    const [inserted] = await db.insert(testimonials).values({
      name: values.name,
      achievement: values.achievement ?? null,
      batch: values.batch ?? null,
      quote: values.quote,
      initials: values.initials ?? null,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return ApiResponse.internalServerError("Failed to create testimonial.");
  }
}
