import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import { uploadMedia } from "./upload.api";
import type { GalleryImageItem, UploadImageResponse } from "@/types/gallery";
import type {
  GalleryInput,
  PatchGalleryInput,
} from "@/validations/gallery.schema";

export async function getGalleryList(): Promise<GalleryImageItem[]> {
  try {
    const { data } = await apiClient.get("/gallery");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createGalleryImage(
  values: GalleryInput,
): Promise<GalleryImageItem> {
  try {
    const { data } = await apiClient.post("/gallery", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateGalleryImage({
  id,
  data: values,
}: {
  id: number;
  data: PatchGalleryInput;
}): Promise<GalleryImageItem> {
  try {
    const { data } = await apiClient.patch(`/gallery/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteGalleryImage(id: number): Promise<void> {
  try {
    await apiClient.delete(`/gallery/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function uploadGalleryImage(

  file: File,
): Promise<UploadImageResponse> {
  return uploadMedia({ file, folder: "gallery" });
}

