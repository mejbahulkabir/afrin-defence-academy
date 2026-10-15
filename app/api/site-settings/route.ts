import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { siteSettings } from "@/database/app-schema";
import { patchSiteSettingsSchema } from "@/validations/site-settings.schema";

export async function GET(request: NextRequest) {
    try {
        const [settingsData] = await db
            .select()
            .from(siteSettings)
            .limit(1);

        if (!settingsData) {
            if (!settingsData) {
                return ApiResponse.ok({
                    name: "",
                    shortName: "",
                    tagline: "",
                    description: "",
                    phone: "",
                    phoneRaw: "",
                    email: "",
                    whatsapp: "",
                    address: "",
                    mapsEmbed: "",
                    socials: {
                        facebook: "",
                        instagram: "",
                        youtube: "",
                        twitter: "",
                        linkedin: "",
                    },
                });
            }
        }

        return ApiResponse.ok(settingsData);
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return ApiResponse.internalServerError("Failed to fetch site settings.");
    }
}



export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return ApiResponse.unauthorized();
        }

        if (!["owner", "admin"].includes(session.user.role ?? "")) {
            return ApiResponse.forbidden();
        }

        const body: unknown = await request.json();
        const result = patchSiteSettingsSchema.safeParse(body);

        if (!result.success) {
            return ApiResponse.badRequest(
                "Validation failed.",
                result.error.flatten().fieldErrors,
            );
        }

        const values = result.data;
        const [existingSettings] = await db
            .select()
            .from(siteSettings)
            .limit(1);

        if (existingSettings) {
            const updates = {
                ...values,
                ...(values.socials
                    ? {
                        socials: {
                            ...(existingSettings.socials ?? {}),
                            ...values.socials,
                        },
                    }
                    : {}),
                updatedAt: new Date(),
            };

            await db
                .update(siteSettings)
                .set(updates)
                .where(eq(siteSettings.id, existingSettings.id));

            const [updatedSettings] = await db
                .select()
                .from(siteSettings)
                .where(eq(siteSettings.id, existingSettings.id))
                .limit(1);

            return ApiResponse.ok(updatedSettings);
        }

        await db.insert(siteSettings).values({
            ...values,
            name: values.name ?? "Afrin Defence Academy",
            socials: values.socials ?? {},
            updatedAt: new Date(),
        });

        const [createdSettings] = await db
            .select()
            .from(siteSettings)
            .limit(1);

        return ApiResponse.ok(createdSettings);
    } catch (error) {
        console.error("Error saving site settings:", error);

        return ApiResponse.internalServerError(
            "Failed to save site settings.",
        );
    }
}