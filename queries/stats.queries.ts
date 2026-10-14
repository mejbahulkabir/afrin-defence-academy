import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { StatItem } from "@/types/stats";
import type { PatchStatInput, StatInput } from "@/validations/stats.schema";
import {
  createStat,
  deleteStat,
  getStatsList,
  updateStat,
} from "./stats.api";

export const statsKeys = {
  all: ["stats"] as const,
  lists: () => [...statsKeys.all, "list"] as const,
  detail: (id: number) => [...statsKeys.all, "detail", id] as const,
};

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: statsKeys.lists(),
    queryFn: getStatsList,
  });

export const createStatMutationOptions = () =>
  mutationOptions<StatItem, unknown, StatInput>({
    mutationKey: [...statsKeys.all, "create"] as const,
    mutationFn: createStat,
  });

export const updateStatMutationOptions = () =>
  mutationOptions<StatItem, unknown, { id: number; data: PatchStatInput }>({
    mutationKey: [...statsKeys.all, "update"] as const,
    mutationFn: updateStat,
  });

export const deleteStatMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...statsKeys.all, "delete"] as const,
    mutationFn: deleteStat,
  });

export const useStatsQuery = () => {
  return useQuery(statsQueryOptions());
};

export const useCreateStatMutation = (
  options?: UseMutationOptions<StatItem, unknown, StatInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createStatMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: statsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateStatMutation = (
  options?: UseMutationOptions<StatItem, unknown, { id: number; data: PatchStatInput }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateStatMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: statsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteStatMutation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteStatMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: statsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
