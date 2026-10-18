import { z } from "zod";

const optionalString = z.string().trim().optional();

export const testimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  achievement: optionalString,
  batch: optionalString,
  quote: z
    .string()
    .trim()
    .min(1, "Quote is required"),
  initials: optionalString,
  order: z
    .number()
    .int("Order must be an integer")
    .default(0),
});

export const patchTestimonialSchema = testimonialSchema.partial();

export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type PatchTestimonialInput = z.infer<typeof patchTestimonialSchema>;
