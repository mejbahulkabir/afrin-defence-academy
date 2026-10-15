import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type {
  AdmissionSubmissionItem,
  AdmissionSubmissionQueryParams,
  AdmissionSubmissionsResponse,
} from "@/types/admission";
import type {
  AdmissionSubmissionInput,
  PatchAdmissionSubmissionInput,
} from "@/validations/admission.schema";
import {
  deleteAdmissionSubmission,
  getAdmissionSubmissions,
  submitAdmissionForm,
  updateAdmissionSubmission,
} from "./admission.api";

export const admissionKeys = {
  all: ["submissions", "admission"] as const,
  lists: () => [...admissionKeys.all, "list"] as const,
  list: (params?: AdmissionSubmissionQueryParams) =>
    [...admissionKeys.lists(), params] as const,
  detail: (id: number) => [...admissionKeys.all, "detail", id] as const,
};

export const admissionSubmissionsQueryOptions = (
  params?: AdmissionSubmissionQueryParams,
) =>
  queryOptions({
    queryKey: admissionKeys.list(params),
    queryFn: () => getAdmissionSubmissions(params),
  });

export const submitAdmissionMutationOptions = () =>
  mutationOptions<AdmissionSubmissionItem, unknown, AdmissionSubmissionInput>({
    mutationKey: [...admissionKeys.all, "submit"] as const,
    mutationFn: submitAdmissionForm,
  });

export const updateAdmissionSubmissionMutationOptions = () =>
  mutationOptions<
    AdmissionSubmissionItem,
    unknown,
    { id: number; data: PatchAdmissionSubmissionInput }
  >({
    mutationKey: [...admissionKeys.all, "update"] as const,
    mutationFn: updateAdmissionSubmission,
  });

export const deleteAdmissionSubmissionMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...admissionKeys.all, "delete"] as const,
    mutationFn: deleteAdmissionSubmission,
  });

// Admin: Query paginated admission submissions
export const useAdmissionSubmissionsQuery = (
  params?: AdmissionSubmissionQueryParams,
) => {
  return useQuery(admissionSubmissionsQueryOptions(params));
};

// Public: Submit admission application
export const useSubmitAdmissionMutation = (
  options?: UseMutationOptions<
    AdmissionSubmissionItem,
    unknown,
    AdmissionSubmissionInput
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...submitAdmissionMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: admissionKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

// Admin: Update admission application (e.g. handled status)
export const useUpdateAdmissionSubmissionMutation = (
  options?: UseMutationOptions<
    AdmissionSubmissionItem,
    unknown,
    { id: number; data: PatchAdmissionSubmissionInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateAdmissionSubmissionMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: admissionKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

// Admin: Delete admission application
export const useDeleteAdmissionSubmissionMutation = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteAdmissionSubmissionMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: admissionKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
