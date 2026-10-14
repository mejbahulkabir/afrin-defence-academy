import { z } from "zod";

const optionalString = z.string().trim().optional();

export const bannerSlotEnum = z.enum(["hero", "cta"]);

export const bannerSchema = z.object({
  slot: bannerSlotEnum.default("hero"),
  image: z
    .string()
    .trim()
    .min(1, "Banner image is required"),
  eyebrow: optionalString,
  title: optionalString,
  titleHighlight: optionalString,
  subtitle: optionalString,
  ctaLabel: optionalString,
  ctaHref: z
    .string()
    .trim()
    .max(2048, "Link URL must be at most 2048 characters")
    .optional(),
  secondaryLabel: optionalString,
  secondaryHref: z
    .string()
    .trim()
    .max(2048, "Link URL must be at most 2048 characters")
    .optional(),
  active: z.boolean().default(true),
  order: z.number().int("Order must be an integer").default(0),
});

export const patchBannerSchema = bannerSchema.partial();

export type BannerInput = z.infer<typeof bannerSchema>;
export type PatchBannerInput = z.infer<typeof patchBannerSchema>;
