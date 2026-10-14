import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type {
  ContactSubmissionItem,
  ContactSubmissionQueryParams,
  ContactSubmissionsResponse,
} from "@/types/contact";
import type {
  ContactSubmissionInput,
  PatchContactSubmissionInput,
} from "@/validations/contact.schema";
import {
  deleteContactSubmission,
  getContactSubmissions,
  submitContactForm,
  updateContactSubmission,
} from "./contact.api";

export const contactKeys = {
  all: ["submissions", "contact"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (params?: ContactSubmissionQueryParams) =>
    [...contactKeys.lists(), params] as const,
  detail: (id: number) => [...contactKeys.all, "detail", id] as const,
};

export const contactSubmissionsQueryOptions = (
  params?: ContactSubmissionQueryParams,
) =>
  queryOptions({
    queryKey: contactKeys.list(params),
    queryFn: () => getContactSubmissions(params),
  });

export const submitContactMutationOptions = () =>
  mutationOptions<ContactSubmissionItem, unknown, ContactSubmissionInput>({
    mutationKey: [...contactKeys.all, "submit"] as const,
    mutationFn: submitContactForm,
  });

export const updateContactSubmissionMutationOptions = () =>
  mutationOptions<
    ContactSubmissionItem,
    unknown,
    { id: number; data: PatchContactSubmissionInput }
  >({
    mutationKey: [...contactKeys.all, "update"] as const,
    mutationFn: updateContactSubmission,
  });

export const deleteContactSubmissionMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...contactKeys.all, "delete"] as const,
    mutationFn: deleteContactSubmission,
  });

// Admin: Query paginated contact submissions
export const useContactSubmissionsQuery = (
  params?: ContactSubmissionQueryParams,
) => {
  return useQuery(contactSubmissionsQueryOptions(params));
};

// Public: Submit contact inquiry
export const useSubmitContactMutation = (
  options?: UseMutationOptions<
    ContactSubmissionItem,
    unknown,
    ContactSubmissionInput
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...submitContactMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: contactKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

// Admin: Update contact inquiry (handled status)
export const useUpdateContactSubmissionMutation = (
  options?: UseMutationOptions<
    ContactSubmissionItem,
    unknown,
    { id: number; data: PatchContactSubmissionInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateContactSubmissionMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: contactKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

// Admin: Delete contact inquiry
export const useDeleteContactSubmissionMutation = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteContactSubmissionMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: contactKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
