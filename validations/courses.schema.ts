import { z } from "zod";

const optionalString = z.string().trim().optional();

export const courseModeEnum = z.enum(["Online", "Offline", "Hybrid"]);
export const courseLevelEnum = z.enum(["Foundation", "Intermediate", "Advanced"]);

export const courseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255, "Slug must be at most 255 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z
    .string()
    .trim()
    .min(1, "Course title is required")
    .max(255, "Course title must be at most 255 characters"),
  duration: optionalString,
  mode: courseModeEnum.default("Hybrid"),
  level: courseLevelEnum.default("Foundation"),
  description: optionalString,
  features: z.array(z.string().trim()).default([]),
  popular: z.boolean().default(false),
  order: z.number().int("Order must be an integer").default(0),
});

export const patchCourseSchema = courseSchema.partial();

export type CourseInput = z.infer<typeof courseSchema>;
export type PatchCourseInput = z.infer<typeof patchCourseSchema>;
