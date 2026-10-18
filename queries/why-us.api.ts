import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { WhyUsItem } from "@/types/why-us";
import type { PatchWhyUsInput, WhyUsInput } from "@/validations/why-us.schema";

export async function getWhyUsList(): Promise<WhyUsItem[]> {
  try {
    const { data } = await apiClient.get("/why-us");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createWhyUs(values: WhyUsInput): Promise<WhyUsItem> {
  try {
    const { data } = await apiClient.post("/why-us", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateWhyUs({
  id,
  data: values,
}: {
  id: number;
  data: PatchWhyUsInput;
}): Promise<WhyUsItem> {
  try {
    const { data } = await apiClient.patch(`/why-us/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteWhyUs(id: number): Promise<void> {
  try {
    await apiClient.delete(`/why-us/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
