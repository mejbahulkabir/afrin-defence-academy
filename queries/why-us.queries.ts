import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { WhyUsItem } from "@/types/why-us";
import type { PatchWhyUsInput, WhyUsInput } from "@/validations/why-us.schema";
import {
  createWhyUs,
  deleteWhyUs,
  getWhyUsList,
  updateWhyUs,
} from "./why-us.api";

export const whyUsKeys = {
  all: ["why-us"] as const,
  lists: () => [...whyUsKeys.all, "list"] as const,
  detail: (id: number) => [...whyUsKeys.all, "detail", id] as const,
};

export const whyUsQueryOptions = () =>
  queryOptions({
    queryKey: whyUsKeys.lists(),
    queryFn: getWhyUsList,
  });

export const createWhyUsMutationOptions = () =>
  mutationOptions<WhyUsItem, unknown, WhyUsInput>({
    mutationKey: [...whyUsKeys.all, "create"] as const,
    mutationFn: createWhyUs,
  });

export const updateWhyUsMutationOptions = () =>
  mutationOptions<WhyUsItem, unknown, { id: number; data: PatchWhyUsInput }>({
    mutationKey: [...whyUsKeys.all, "update"] as const,
    mutationFn: updateWhyUs,
  });

export const deleteWhyUsMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...whyUsKeys.all, "delete"] as const,
    mutationFn: deleteWhyUs,
  });

export const useWhyUsQuery = () => {
  return useQuery(whyUsQueryOptions());
};

export const useCreateWhyUsMutation = (
  options?: UseMutationOptions<WhyUsItem, unknown, WhyUsInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createWhyUsMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: whyUsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateWhyUsMutation = (
  options?: UseMutationOptions<WhyUsItem, unknown, { id: number; data: PatchWhyUsInput }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateWhyUsMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: whyUsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteWhyUsMutation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteWhyUsMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: whyUsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
