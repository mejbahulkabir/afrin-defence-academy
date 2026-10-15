import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "./dashboard.api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
};

export const dashboardOverviewQueryOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.overview(),
    queryFn: getDashboardOverview,
    refetchInterval: 30000,
  });

export const useDashboardOverviewQuery = () => {
  return useQuery(dashboardOverviewQueryOptions());
};
