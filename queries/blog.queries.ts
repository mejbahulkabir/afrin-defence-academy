import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { BlogPostItem } from "@/types/blog";
import type {
  BlogPostInput,
  PatchBlogPostInput,
} from "@/validations/blog.schema";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  getBlogPostsList,
  updateBlogPost,
} from "./blog.api";

export const blogKeys = {
  all: ["blog"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  detail: (id: number) => [...blogKeys.all, "detail", id] as const,
};

export const blogPostsQueryOptions = () =>
  queryOptions({
    queryKey: blogKeys.lists(),
    queryFn: getBlogPostsList,
  });

export const blogPostQueryOptions = (id: number) =>
  queryOptions({
    queryKey: blogKeys.detail(id),
    queryFn: () => getBlogPostById(id),
    enabled: !!id,
  });


export const createBlogPostMutationOptions = () =>
  mutationOptions<BlogPostItem, unknown, BlogPostInput>({
    mutationKey: [...blogKeys.all, "create"] as const,
    mutationFn: createBlogPost,
  });

export const updateBlogPostMutationOptions = () =>
  mutationOptions<
    BlogPostItem,
    unknown,
    { id: number; data: PatchBlogPostInput }
  >({
    mutationKey: [...blogKeys.all, "update"] as const,
    mutationFn: updateBlogPost,
  });

export const deleteBlogPostMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...blogKeys.all, "delete"] as const,
    mutationFn: deleteBlogPost,
  });

export const useBlogPostsQuery = () => {
  return useQuery(blogPostsQueryOptions());
};

export const useBlogPostQuery = (id: number) => {
  return useQuery(blogPostQueryOptions(id));
};


export const useCreateBlogPostMutation = (
  options?: UseMutationOptions<BlogPostItem, unknown, BlogPostInput>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createBlogPostMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateBlogPostMutation = (
  options?: UseMutationOptions<
    BlogPostItem,
    unknown,
    { id: number; data: PatchBlogPostInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateBlogPostMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteBlogPostMutation = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteBlogPostMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};
