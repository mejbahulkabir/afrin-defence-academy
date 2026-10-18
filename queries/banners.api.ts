import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { BannerItem, BannerSlot } from "@/types/banner";
import type {
  BannerInput,
  PatchBannerInput,
} from "@/validations/banners.schema";

export async function getBannersList(slot?: BannerSlot): Promise<BannerItem[]> {
  try {
    const { data } = await apiClient.get("/banners", {
      params: slot ? { slot } : undefined,
    });
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createBanner(values: BannerInput): Promise<BannerItem> {
  try {
    const { data } = await apiClient.post("/banners", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateBanner({
  id,
  data: values,
}: {
  id: number;
  data: PatchBannerInput;
}): Promise<BannerItem> {
  try {
    const { data } = await apiClient.patch(`/banners/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteBanner(id: number): Promise<void> {
  try {
    await apiClient.delete(`/banners/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
