import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { CourseItem } from "@/types/course";
import type {
  CourseInput,
  PatchCourseInput,
} from "@/validations/courses.schema";
import {
  createCourse,
  deleteCourse,
  getCoursesList,
  updateCourse,
} from "./courses.api";

export const coursesKeys = {
  all: ["courses"] as const,
  lists: () => [...coursesKeys.all, "list"] as const,
  detail: (id: number) => [...coursesKeys.all, "detail", id] as const,
};

export const coursesQueryOptions = () =>
  queryOptions({
    queryKey: coursesKeys.lists(),
    queryFn: getCoursesList,
  });

export const createCourseMutationOptions = () =>
  mutationOptions<CourseItem, unknown, CourseInput>({
    mutationKey: [...coursesKeys.all, "create"] as const,
    mutationFn: createCourse,
  });

export const updateCourseMutationOptions = () =>
  mutationOptions<
    CourseItem,
    unknown,
    { id: number; data: PatchCourseInput }
  >({
    mutationKey: [...coursesKeys.all, "update"] as const,
    mutationFn: updateCourse,
  });

export const deleteCourseMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...coursesKeys.all, "delete"] as const,
    mutationFn: deleteCourse,
  });

export const useCoursesQuery = () => {
  return useQuery(coursesQueryOptions());
};

export const useCreateCourseMutation = (
  options?: UseMutationOptions<CourseItem, unknown, CourseInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createCourseMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: coursesKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateCourseMutation = (
  options?: UseMutationOptions<
    CourseItem,
    unknown,
    { id: number; data: PatchCourseInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateCourseMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: coursesKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteCourseMutation = (
  options?: UseMutationOptions<void, unknown, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteCourseMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: coursesKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
