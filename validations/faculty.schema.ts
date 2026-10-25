import { z } from "zod";

const optionalString = z.string().trim().optional();

export const facultySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  role: z
    .string()
    .trim()
    .min(1, "Role is required")
    .max(255, "Role must be at most 255 characters"),
  image: optionalString,
  rank: optionalString,
  experience: optionalString,
  specialization: optionalString,
  order: z
    .number()
    .int("Order must be an integer")
    .default(0),
});

export const patchFacultySchema = facultySchema.partial();

export type FacultyInput = z.infer<typeof facultySchema>;
export type PatchFacultyInput = z.infer<typeof patchFacultySchema>;
