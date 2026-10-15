import { z } from "zod";

const optionalString = z.string().trim().optional();

export const blogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255, "Slug must be at most 255 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  image: optionalString,
  excerpt: optionalString,
  content: optionalString,
  category: optionalString,
  author: optionalString,
  date: optionalString,
  readingTime: optionalString,
  published: z.boolean().default(true),
});

export const patchBlogPostSchema = blogPostSchema.partial();

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type PatchBlogPostInput = z.infer<typeof patchBlogPostSchema>;
