import { z } from "zod";

const optionalString = z.string().trim().optional();

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be at most 255 characters"),
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
  subject: optionalString,
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

export const patchContactSubmissionSchema = z.object({
  handled: z.boolean().optional(),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type PatchContactSubmissionInput = z.infer<typeof patchContactSubmissionSchema>;
