import { z } from "zod";

export const whyUsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  desc: z
    .string()
    .trim()
    .min(1, "Description is required"),
  order: z
    .number()
    .int("Order must be an integer")
    .default(0),
});

export const patchWhyUsSchema = whyUsSchema.partial();

export type WhyUsInput = z.infer<typeof whyUsSchema>;
export type PatchWhyUsInput = z.infer<typeof patchWhyUsSchema>;
