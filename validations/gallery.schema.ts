import { z } from "zod";

const optionalString = z.string().trim().optional();

export const gallerySchema = z.object({
  src: z
    .string()
    .trim()
    .min(1, "Image is required"),
  alt: z
    .string()
    .trim()
    .max(500, "Alt text must be at most 500 characters")
    .optional(),
  caption: optionalString,
  active: z.boolean().default(true),
  order: z.number().int("Order must be an integer").default(0),
});

export const patchGallerySchema = gallerySchema.partial();

export type GalleryInput = z.infer<typeof gallerySchema>;
export type PatchGalleryInput = z.infer<typeof patchGallerySchema>;
