import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { BannerItem, BannerSlot } from "@/types/banner";
import type {
  BannerInput,
  PatchBannerInput,
} from "@/validations/banners.schema";
import {
  createBanner,
  deleteBanner,
  getBannersList,
  updateBanner,
} from "./banners.api";

export const bannersKeys = {
  all: ["banners"] as const,
  lists: () => [...bannersKeys.all, "list"] as const,
  list: (slot?: BannerSlot) => [...bannersKeys.lists(), { slot }] as const,
  detail: (id: number) => [...bannersKeys.all, "detail", id] as const,
};

export const bannersQueryOptions = (slot?: BannerSlot) =>
  queryOptions({
    queryKey: bannersKeys.list(slot),
    queryFn: () => getBannersList(slot),
  });

export const createBannerMutationOptions = () =>
  mutationOptions<BannerItem, unknown, BannerInput>({
    mutationKey: [...bannersKeys.all, "create"] as const,
    mutationFn: createBanner,
  });

export const updateBannerMutationOptions = () =>
  mutationOptions<
    BannerItem,
    unknown,
    { id: number; data: PatchBannerInput }
  >({
    mutationKey: [...bannersKeys.all, "update"] as const,
    mutationFn: updateBanner,
  });

export const deleteBannerMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...bannersKeys.all, "delete"] as const,
    mutationFn: deleteBanner,
  });

export const useBannersQuery = (slot?: BannerSlot) => {
  return useQuery(bannersQueryOptions(slot));
};

export const useCreateBannerMutation = (
  options?: UseMutationOptions<BannerItem, unknown, BannerInput>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createBannerMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: bannersKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateBannerMutation = (
  options?: UseMutationOptions<
    BannerItem,
    unknown,
    { id: number; data: PatchBannerInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateBannerMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: bannersKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteBannerMutation = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteBannerMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: bannersKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
