import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { admissionSubmissions } from "@/database/app-schema";
import { patchAdmissionSubmissionSchema } from "@/validations/admission.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: _request.headers,
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

    const [item] = await db
      .select()
      .from(admissionSubmissions)
      .where(eq(admissionSubmissions.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Admission submission not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching admission submission:", error);
    return ApiResponse.internalServerError(
      "Failed to fetch admission submission.",
    );
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
      .from(admissionSubmissions)
      .where(eq(admissionSubmissions.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Admission submission not found.");
    }

    const body: unknown = await request.json();
    const result = patchAdmissionSubmissionSchema.safeParse(body);

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
      .update(admissionSubmissions)
      .set(updates)
      .where(eq(admissionSubmissions.id, numId));

    const [updatedItem] = await db
      .select()
      .from(admissionSubmissions)
      .where(eq(admissionSubmissions.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating admission submission:", error);
    return ApiResponse.internalServerError(
      "Failed to update admission submission.",
    );
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
      .from(admissionSubmissions)
      .where(eq(admissionSubmissions.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Admission submission not found.");
    }

    await db
      .delete(admissionSubmissions)
      .where(eq(admissionSubmissions.id, numId));

    return ApiResponse.okMessage("Admission submission deleted successfully.");
  } catch (error) {
    console.error("Error deleting admission submission:", error);
    return ApiResponse.internalServerError(
      "Failed to delete admission submission.",
    );
  }
}
