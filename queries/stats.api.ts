import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { StatItem } from "@/types/stats";
import type { PatchStatInput, StatInput } from "@/validations/stats.schema";

export async function getStatsList(): Promise<StatItem[]> {
  try {
    const { data } = await apiClient.get("/stats");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createStat(values: StatInput): Promise<StatItem> {
  try {
    const { data } = await apiClient.post("/stats", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateStat({
  id,
  data: values,
}: {
  id: number;
  data: PatchStatInput;
}): Promise<StatItem> {
  try {
    const { data } = await apiClient.patch(`/stats/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteStat(id: number): Promise<void> {
  try {
    await apiClient.delete(`/stats/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
