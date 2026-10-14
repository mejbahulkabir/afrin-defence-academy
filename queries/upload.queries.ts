import {
  mutationOptions,
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { UploadMediaOptions, UploadMediaResponse } from "@/types/upload";
import { uploadMedia } from "./upload.api";

export const uploadMediaMutationOptions = () =>
  mutationOptions<UploadMediaResponse, unknown, UploadMediaOptions>({
    mutationKey: ["upload"] as const,
    mutationFn: uploadMedia,
  });

export const useUploadMediaMutation = (
  options?: UseMutationOptions<UploadMediaResponse, unknown, UploadMediaOptions>,
) => {
  return useMutation({
    ...uploadMediaMutationOptions(),
    ...options,
  });
};
