import { z } from "zod";

export const statSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(255, "Label must be at most 255 characters"),
  value: z
    .number()
    .int("Value must be an integer")
    .min(1, "Value must be at least 1"),
  suffix: z
    .string()
    .trim()
    .max(50, "Suffix must be at most 50 characters")
    .default(""),
  order: z
    .number()
    .int("Order must be an integer")
    .default(0),
});

export const patchStatSchema = statSchema.partial();

export type StatInput = z.infer<typeof statSchema>;
export type PatchStatInput = z.infer<typeof patchStatSchema>;
