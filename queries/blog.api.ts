import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { BlogPostItem } from "@/types/blog";
import type {
  BlogPostInput,
  PatchBlogPostInput,
} from "@/validations/blog.schema";

export async function getBlogPostsList(): Promise<BlogPostItem[]> {
  try {
    if (typeof window !== "undefined") {
      const { data } = await apiClient.get("/blog");
      return data.data ?? data;
    }
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getBlogPostById(id: number): Promise<BlogPostItem> {
  try {
    const { data } = await apiClient.get(`/blog/${id}`);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostItem | null> {
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? ""
        : process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/blog?slug=${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch (error) {
    console.error("Error fetching blog post by slug via API:", error);
    return null;
  }
}


export async function createBlogPost(
  values: BlogPostInput,
): Promise<BlogPostItem> {
  try {
    const { data } = await apiClient.post("/blog", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateBlogPost({
  id,
  data: values,
}: {
  id: number;
  data: PatchBlogPostInput;
}): Promise<BlogPostItem> {
  try {
    const { data } = await apiClient.patch(`/blog/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteBlogPost(id: number): Promise<void> {
  try {
    await apiClient.delete(`/blog/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
