import { NextRequest } from "next/server";
import { and, count, desc, eq, like, or } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { admissionSubmissions } from "@/database/app-schema";
import { admissionSubmissionSchema } from "@/validations/admission.schema";

function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `ADA-${year}-${timePart}${randomPart}`;
}

// GET /api/submissions/admission - Admin only: List admission applications with pagination & filters
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
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const handledParam = searchParams.get("handled");
    const search = searchParams.get("search")?.trim();
    const targetExam = searchParams.get("targetExam")?.trim();
    const course = searchParams.get("course")?.trim();

    const conditions = [];

    if (handledParam === "true") {
      conditions.push(eq(admissionSubmissions.handled, true));
    } else if (handledParam === "false") {
      conditions.push(eq(admissionSubmissions.handled, false));
    }

    if (targetExam) {
      conditions.push(eq(admissionSubmissions.targetExam, targetExam));
    }

    if (course) {
      conditions.push(eq(admissionSubmissions.course, course));
    }

    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          like(admissionSubmissions.fullName, searchPattern),
          like(admissionSubmissions.email, searchPattern),
          like(admissionSubmissions.phone, searchPattern),
          like(admissionSubmissions.applicationId, searchPattern),
          like(admissionSubmissions.city, searchPattern),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await db
      .select({ total: count() })
      .from(admissionSubmissions)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    // Get paginated items
    const items = await db
      .select()
      .from(admissionSubmissions)
      .where(whereClause)
      .orderBy(desc(admissionSubmissions.createdAt))
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
    console.error("Error fetching admission submissions:", error);
    return ApiResponse.internalServerError(
      "Failed to fetch admission submissions.",
    );
  }
}

// POST /api/submissions/admission - Public: Website candidates submitting admission applications
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const result = admissionSubmissionSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;
    const applicationId = generateApplicationId();

    const [inserted] = await db.insert(admissionSubmissions).values({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      dob: values.dob ?? null,
      qualification: values.qualification ?? null,
      course: values.course ?? null,
      targetExam: values.targetExam ?? null,
      city: values.city ?? null,
      message: values.message ?? null,
      applicationId,
      handled: false,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(admissionSubmissions)
        .where(eq(admissionSubmissions.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created({
      ...values,
      applicationId,
      handled: false,
    });
  } catch (error) {
    console.error("Error submitting admission application:", error);
    return ApiResponse.internalServerError(
      "Failed to submit admission application.",
    );
  }
}
