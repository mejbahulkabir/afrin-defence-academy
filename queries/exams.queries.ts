import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { ExamItem } from "@/types/exam";
import type {
  ExamInput,
  PatchExamInput,
} from "@/validations/exams.schema";
import {
  createExam,
  deleteExam,
  getExamsList,
  updateExam,
} from "./exams.api";

export const examsKeys = {
  all: ["exams"] as const,
  lists: () => [...examsKeys.all, "list"] as const,
  detail: (id: number) => [...examsKeys.all, "detail", id] as const,
};

export const examsQueryOptions = () =>
  queryOptions({
    queryKey: examsKeys.lists(),
    queryFn: getExamsList,
  });

export const createExamMutationOptions = () =>
  mutationOptions<ExamItem, unknown, ExamInput>({
    mutationKey: [...examsKeys.all, "create"] as const,
    mutationFn: createExam,
  });

export const updateExamMutationOptions = () =>
  mutationOptions<
    ExamItem,
    unknown,
    { id: number; data: PatchExamInput }
  >({
    mutationKey: [...examsKeys.all, "update"] as const,
    mutationFn: updateExam,
  });

export const deleteExamMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...examsKeys.all, "delete"] as const,
    mutationFn: deleteExam,
  });

export const useExamsQuery = () => {
  return useQuery(examsQueryOptions());
};

export const useCreateExamMutation = (
  options?: UseMutationOptions<ExamItem, unknown, ExamInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createExamMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: examsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateExamMutation = (
  options?: UseMutationOptions<
    ExamItem,
    unknown,
    { id: number; data: PatchExamInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateExamMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: examsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteExamMutation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteExamMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: examsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
