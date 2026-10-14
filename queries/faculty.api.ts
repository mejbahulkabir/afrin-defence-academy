import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { FacultyItem } from "@/types/faculty";
import type {
  FacultyInput,
  PatchFacultyInput,
} from "@/validations/faculty.schema";

export async function getFacultyList(): Promise<FacultyItem[]> {
  try {
    const { data } = await apiClient.get("/faculty");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createFaculty(
  values: FacultyInput
): Promise<FacultyItem> {
  try {
    const { data } = await apiClient.post("/faculty", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateFaculty({
  id,
  data: values,
}: {
  id: number;
  data: PatchFacultyInput;
}): Promise<FacultyItem> {
  try {
    const { data } = await apiClient.patch(`/faculty/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteFaculty(id: number): Promise<void> {
  try {
    await apiClient.delete(`/faculty/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
