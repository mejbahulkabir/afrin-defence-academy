import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { whyUs } from "@/database/app-schema";
import { whyUsSchema } from "@/validations/why-us.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(whyUs)
      .orderBy(asc(whyUs.order), desc(whyUs.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching why-us items:", error);
    return ApiResponse.internalServerError("Failed to fetch why-us items.");
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
    const result = whyUsSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;
    const [inserted] = await db.insert(whyUs).values({
      title: values.title,
      desc: values.desc,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(whyUs)
        .where(eq(whyUs.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating why-us item:", error);
    return ApiResponse.internalServerError("Failed to create why-us item.");
  }
}
