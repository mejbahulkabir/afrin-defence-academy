import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { exams } from "@/database/app-schema";
import { examSchema } from "@/validations/exams.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(exams)
      .orderBy(asc(exams.order), desc(exams.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return ApiResponse.internalServerError("Failed to fetch exams.");
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
    const result = examSchema.safeParse(body);

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
      .from(exams)
      .where(eq(exams.slug, values.slug))
      .limit(1);

    if (existingSlug) {
      return ApiResponse.conflict("An exam with this slug already exists.");
    }

    const [inserted] = await db.insert(exams).values({
      slug: values.slug,
      name: values.name,
      full: values.full ?? null,
      branch: values.branch ?? null,
      description: values.description ?? null,
      eligibility: values.eligibility ?? null,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(exams)
        .where(eq(exams.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating exam:", error);
    return ApiResponse.internalServerError("Failed to create exam.");
  }
}
