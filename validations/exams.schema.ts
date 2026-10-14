import { z } from "zod";

const optionalString = z.string().trim().optional();

export const examSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255, "Slug must be at most 255 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  name: z
    .string()
    .trim()
    .min(1, "Exam name is required")
    .max(255, "Exam name must be at most 255 characters"),
  full: optionalString,
  branch: optionalString,
  description: optionalString,
  eligibility: optionalString,
  order: z
    .number()
    .int("Order must be an integer")
    .default(0),
});

export const patchExamSchema = examSchema.partial();

export type ExamInput = z.infer<typeof examSchema>;
export type PatchExamInput = z.infer<typeof patchExamSchema>;
