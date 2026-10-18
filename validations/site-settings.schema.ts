import { z } from "zod";

const optionalString = z.string().trim().optional();

export const siteSettingsSchema = z.object({
  name: z.string().trim().min(1, "Site name is required"),

  shortName: optionalString,
  tagline: optionalString,
  description: optionalString,

  phone: optionalString,
  phoneRaw: optionalString,
  email: z.union([z.email("Please enter a valid email address"), z.literal("")]).optional(),
  whatsapp: optionalString,
  address: optionalString,
  mapsEmbed: optionalString,

  socials: z
    .object({
      facebook: optionalString,
      instagram: optionalString,
      youtube: optionalString,
      twitter: optionalString,
      linkedin: optionalString,
    })
    .optional(),
});

export const patchSiteSettingsSchema = siteSettingsSchema
  .partial()
  .extend({
    socials: siteSettingsSchema.shape.socials,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type PatchSiteSettingsInput = z.infer<
  typeof patchSiteSettingsSchema
>;