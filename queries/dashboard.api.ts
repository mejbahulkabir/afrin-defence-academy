import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { DashboardOverviewResponse } from "@/types/dashboard";

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  try {
    const { data } = await apiClient.get("/dashboard/overview");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}
