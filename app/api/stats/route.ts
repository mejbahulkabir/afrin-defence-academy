import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { stats } from "@/database/app-schema";
import { statSchema } from "@/validations/stats.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(stats)
      .orderBy(asc(stats.order), desc(stats.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return ApiResponse.internalServerError("Failed to fetch stats.");
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
    const result = statSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;
    const [inserted] = await db.insert(stats).values({
      label: values.label,
      value: values.value,
      suffix: values.suffix ?? "",
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(stats)
        .where(eq(stats.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating stat:", error);
    return ApiResponse.internalServerError("Failed to create stat.");
  }
}
