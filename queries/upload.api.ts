import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { UploadMediaOptions, UploadMediaResponse } from "@/types/upload";

export async function uploadMedia({
  file,
  folder,
}: UploadMediaOptions): Promise<UploadMediaResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const { data } = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}
