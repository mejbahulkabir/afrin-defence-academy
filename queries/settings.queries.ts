import { useEffect, useState } from "react";
import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { SiteSettings } from "@/types/site-settings";
import { getSiteSettings, updateSiteSettings } from "./settings.api";

export const settingsKeys = {
  all: ["settings"] as const,
  site: () => [...settingsKeys.all, "site"] as const,
};

export const siteSettingsQueryOptions = () =>
  queryOptions({
    queryKey: settingsKeys.site(),
    queryFn: getSiteSettings,
  });

export const updateSiteSettingsMutationOptions = () =>
  mutationOptions<SiteSettings, unknown, SiteSettings>({
    mutationKey: [...settingsKeys.all, "update-site"] as const,
    mutationFn: updateSiteSettings,
  });

export const useSiteSettingsQuery = () => {
  const query = useQuery(siteSettingsQueryOptions());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    ...query,
    data: mounted ? query.data : undefined,
    isPending: !mounted || query.isPending,
    isLoading: !mounted || query.isLoading,
    isError: mounted ? query.isError : false,
    error: mounted ? query.error : null,
    isMounted: mounted,
  };
};

export const useUpdateSiteSettingsMutation = (
  options?: UseMutationOptions<SiteSettings, unknown, SiteSettings>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateSiteSettingsMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.site(),
      });
      await options?.onSuccess?.(...args);
    },
  });
};