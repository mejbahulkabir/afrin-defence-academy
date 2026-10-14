import { NextRequest } from "next/server";
import { and, count, desc, eq, like, or } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { contactSubmissions } from "@/database/app-schema";
import { contactSubmissionSchema } from "@/validations/contact.schema";

// GET /api/submissions/contact - Admin only: List contact inquiries with pagination and filters
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const handledParam = searchParams.get("handled");
    const search = searchParams.get("search")?.trim();

    const conditions = [];

    if (handledParam === "true") {
      conditions.push(eq(contactSubmissions.handled, true));
    } else if (handledParam === "false") {
      conditions.push(eq(contactSubmissions.handled, false));
    }

    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          like(contactSubmissions.name, searchPattern),
          like(contactSubmissions.email, searchPattern),
          like(contactSubmissions.phone, searchPattern),
          like(contactSubmissions.subject, searchPattern),
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await db
      .select({ total: count() })
      .from(contactSubmissions)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    // Get paginated items
    const items = await db
      .select()
      .from(contactSubmissions)
      .where(whereClause)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(limit)
      .offset(offset);

    return ApiResponse.ok({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return ApiResponse.internalServerError("Failed to fetch contact submissions.");
  }
}

// POST /api/submissions/contact - Public: Website visitors submitting the contact form
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const result = contactSubmissionSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;

    const [inserted] = await db.insert(contactSubmissions).values({
      name: values.name,
      email: values.email,
      phone: values.phone,
      subject: values.subject ?? null,
      message: values.message,
      handled: false,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(contactSubmissions)
        .where(eq(contactSubmissions.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return ApiResponse.internalServerError("Failed to submit contact message.");
  }
}
