import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { SiteSettings } from "@/types/site-settings";

export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const { data } = await apiClient.get("/site-settings");
        return data.data ?? data;
    } catch (error) {
        throw toApiError(error);
    }
}

export async function updateSiteSettings(values: SiteSettings): Promise<SiteSettings> {
    try {
        const { data } = await apiClient.patch("/site-settings", values);
        return data.data ?? data;
    } catch (error) {
        throw toApiError(error);
    }
}