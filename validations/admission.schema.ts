import { z } from "zod";

const optionalString = z.string().trim().optional();

export const admissionSubmissionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(255, "Full name must be at most 255 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(50, "Phone number is too long")
    .regex(/^[0-9+\-\s()]{7,25}$/, "Please enter a valid phone number"),
  dob: optionalString,
  qualification: optionalString,
  course: optionalString,
  targetExam: optionalString,
  city: optionalString,
  message: optionalString,
});

export const patchAdmissionSubmissionSchema = z.object({
  handled: z.boolean().optional(),
});

export type AdmissionSubmissionInput = z.infer<typeof admissionSubmissionSchema>;
export type PatchAdmissionSubmissionInput = z.infer<
  typeof patchAdmissionSubmissionSchema
>;
