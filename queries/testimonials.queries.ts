import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { TestimonialItem } from "@/types/testimonial";
import type {
  PatchTestimonialInput,
  TestimonialInput,
} from "@/validations/testimonials.schema";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialsList,
  updateTestimonial,
} from "./testimonials.api";

export const testimonialsKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialsKeys.all, "list"] as const,
  detail: (id: number) => [...testimonialsKeys.all, "detail", id] as const,
};

export const testimonialsQueryOptions = () =>
  queryOptions({
    queryKey: testimonialsKeys.lists(),
    queryFn: getTestimonialsList,
  });

export const createTestimonialMutationOptions = () =>
  mutationOptions<TestimonialItem, unknown, TestimonialInput>({
    mutationKey: [...testimonialsKeys.all, "create"] as const,
    mutationFn: createTestimonial,
  });

export const updateTestimonialMutationOptions = () =>
  mutationOptions<
    TestimonialItem,
    unknown,
    { id: number; data: PatchTestimonialInput }
  >({
    mutationKey: [...testimonialsKeys.all, "update"] as const,
    mutationFn: updateTestimonial,
  });

export const deleteTestimonialMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...testimonialsKeys.all, "delete"] as const,
    mutationFn: deleteTestimonial,
  });

export const useTestimonialsQuery = () => {
  return useQuery(testimonialsQueryOptions());
};

export const useCreateTestimonialMutation = (
  options?: UseMutationOptions<TestimonialItem, unknown, TestimonialInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createTestimonialMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: testimonialsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateTestimonialMutation = (
  options?: UseMutationOptions<
    TestimonialItem,
    unknown,
    { id: number; data: PatchTestimonialInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateTestimonialMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: testimonialsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteTestimonialMutation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteTestimonialMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: testimonialsKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
