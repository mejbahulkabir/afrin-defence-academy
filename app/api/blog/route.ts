import { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { blogPosts } from "@/database/app-schema";
import { blogPostSchema } from "@/validations/blog.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [item] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);

      if (!item) {
        return ApiResponse.notFound("Blog post not found.");
      }
      return ApiResponse.ok(item);
    }

    const items = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    return ApiResponse.ok(items);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return ApiResponse.internalServerError("Failed to fetch blog posts.");
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
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.badRequest(
        "Validation failed.",
        result.error.flatten().fieldErrors,
      );
    }

    const values = result.data;

    // Check slug uniqueness
    const [existing] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, values.slug))
      .limit(1);

    if (existing) {
      return ApiResponse.conflict("A blog post with this slug already exists.");
    }

    const [inserted] = await db.insert(blogPosts).values({
      slug: values.slug,
      title: values.title,
      image: values.image ?? null,
      excerpt: values.excerpt ?? null,
      content: values.content ?? null,
      category: values.category ?? null,
      author: values.author ?? null,
      date: values.date ?? null,
      readingTime: values.readingTime ?? null,
      published: values.published ?? true,
    });

    const insertId = (inserted as { insertId?: number })?.insertId;

    if (insertId) {
      const [createdItem] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, insertId))
        .limit(1);

      return ApiResponse.created(createdItem);
    }

    return ApiResponse.created(values);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return ApiResponse.internalServerError("Failed to create blog post.");
  }
}
