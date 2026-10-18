import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { GalleryImageItem, UploadImageResponse } from "@/types/gallery";
import type {
  GalleryInput,
  PatchGalleryInput,
} from "@/validations/gallery.schema";
import {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryList,
  updateGalleryImage,
  uploadGalleryImage,
} from "./gallery.api";

export const galleryKeys = {
  all: ["gallery"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  detail: (id: number) => [...galleryKeys.all, "detail", id] as const,
};

export const galleryQueryOptions = () =>
  queryOptions({
    queryKey: galleryKeys.lists(),
    queryFn: getGalleryList,
  });

export const createGalleryMutationOptions = () =>
  mutationOptions<GalleryImageItem, unknown, GalleryInput>({
    mutationKey: [...galleryKeys.all, "create"] as const,
    mutationFn: createGalleryImage,
  });

export const updateGalleryMutationOptions = () =>
  mutationOptions<
    GalleryImageItem,
    unknown,
    { id: number; data: PatchGalleryInput }
  >({
    mutationKey: [...galleryKeys.all, "update"] as const,
    mutationFn: updateGalleryImage,
  });

export const deleteGalleryMutationOptions = () =>
  mutationOptions<void, unknown, number>({
    mutationKey: [...galleryKeys.all, "delete"] as const,
    mutationFn: deleteGalleryImage,
  });

export const uploadGalleryMutationOptions = () =>
  mutationOptions<UploadImageResponse, unknown, File>({
    mutationKey: [...galleryKeys.all, "upload"] as const,
    mutationFn: uploadGalleryImage,
  });

export const useGalleryQuery = () => {
  return useQuery(galleryQueryOptions());
};

export const useCreateGalleryMutation = (
  options?: UseMutationOptions<GalleryImageItem, unknown, GalleryInput>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createGalleryMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: galleryKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateGalleryMutation = (
  options?: UseMutationOptions<
    GalleryImageItem,
    unknown,
    { id: number; data: PatchGalleryInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateGalleryMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: galleryKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteGalleryMutation = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteGalleryMutationOptions(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: galleryKeys.all,
      });
      await options?.onSuccess?.(...args);
    },
  });
};

export const useUploadGalleryMutation = (
  options?: UseMutationOptions<UploadImageResponse, unknown, File>,
) => {
  return useMutation({
    ...uploadGalleryMutationOptions(),
    ...options,
  });
};
