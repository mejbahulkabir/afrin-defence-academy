import { NextRequest } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { faculty } from "@/database/app-schema";
import { facultySchema } from "@/validations/faculty.schema";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(faculty)
      .orderBy(asc(faculty.order), desc(faculty.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    return ApiResponse.internalServerError("Failed to fetch faculty members.");
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
    const result = facultySchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;
    const [inserted] = await db.insert(faculty).values({
      name: values.name,
      role: values.role,
      image: values.image ?? null,
      rank: values.rank ?? null,
      experience: values.experience ?? null,
      specialization: values.specialization ?? null,
      order: values.order ?? 0,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(faculty)
        .where(eq(faculty.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating faculty member:", error);
    return ApiResponse.internalServerError("Failed to create faculty member.");
  }
}
