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
  return useQuery(siteSettingsQueryOptions());
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