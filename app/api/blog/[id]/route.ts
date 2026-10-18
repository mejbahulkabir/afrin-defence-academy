import { NextRequest } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { blogPosts } from "@/database/app-schema";
import { patchBlogPostSchema } from "@/validations/blog.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return ApiResponse.badRequest("Invalid ID parameter.");
    }

    const [item] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, numId))
      .limit(1);

    if (!item) {
      return ApiResponse.notFound("Blog post not found.");
    }

    return ApiResponse.ok(item);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return ApiResponse.internalServerError("Failed to fetch blog post.");
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
      .from(blogPosts)
      .where(eq(blogPosts.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Blog post not found.");
    }

    const body: unknown = await request.json();
    const result = patchBlogPostSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    // Check slug uniqueness if slug is being updated
    if (result.data.slug && result.data.slug !== existing.slug) {
      const [duplicateSlug] = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, result.data.slug), ne(blogPosts.id, numId)))
        .limit(1);

      if (duplicateSlug) {
        return ApiResponse.conflict("A blog post with this slug already exists.");
      }
    }

    const updates = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db.update(blogPosts).set(updates).where(eq(blogPosts.id, numId));

    const [updatedItem] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, numId))
      .limit(1);

    return ApiResponse.ok(updatedItem);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return ApiResponse.internalServerError("Failed to update blog post.");
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
      .from(blogPosts)
      .where(eq(blogPosts.id, numId))
      .limit(1);

    if (!existing) {
      return ApiResponse.notFound("Blog post not found.");
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, numId));

    return ApiResponse.okMessage("Blog post deleted successfully.");
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return ApiResponse.internalServerError("Failed to delete blog post.");
  }
}
