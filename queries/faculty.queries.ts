import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { FacultyItem } from "@/types/faculty";
import type {
  FacultyInput,
  PatchFacultyInput,
} from "@/validations/faculty.schema";
import {
  createFaculty,
  deleteFaculty,
  getFacultyList,
  updateFaculty,
} from "./faculty.api";

export const facultyKeys = {
  all: ["faculty"] as const,
  lists: () => [...facultyKeys.all, "list"] as const,
  detail: (id: number) => [...facultyKeys.all, "detail", id] as const,
};

export const facultyQueryOptions = () =>
  queryOptions({
    queryKey: facultyKeys.lists(),
    queryFn: getFacultyList,
  });

export const createFacultyMutationOptions = () =>
  mutationOptions<FacultyItem, unknown, FacultyInput>({
    mutationKey: [...facultyKeys.all, "create"] as const,
    mutationFn: createFaculty,
  });

export const updateFacultyMutationOptions = () =>
  mutationOptions<
    FacultyItem,
    unknown,
    { id: number; data: PatchFacultyInput }
  >({
    mutationKey: [...facultyKeys.all, "update"] as const,
    mutationFn: updateFaculty,
  });

export const deleteFacultyMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...facultyKeys.all, "delete"] as const,
    mutationFn: deleteFaculty,
  });

export const useFacultyQuery = () => {
  return useQuery(facultyQueryOptions());
};

export const useCreateFacultyMutation = (
  options?: UseMutationOptions<FacultyItem, unknown, FacultyInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createFacultyMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: facultyKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateFacultyMutation = (
  options?: UseMutationOptions<
    FacultyItem,
    unknown,
    { id: number; data: PatchFacultyInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateFacultyMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: facultyKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteFacultyMutation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteFacultyMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: facultyKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
