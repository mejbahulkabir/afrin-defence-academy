import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { CourseItem } from "@/types/course";
import type {
  CourseInput,
  PatchCourseInput,
} from "@/validations/courses.schema";

export async function getCoursesList(): Promise<CourseItem[]> {
  try {
    const { data } = await apiClient.get("/courses");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createCourse(values: CourseInput): Promise<CourseItem> {
  try {
    const { data } = await apiClient.post("/courses", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateCourse({
  id,
  data: values,
}: {
  id: number;
  data: PatchCourseInput;
}): Promise<CourseItem> {
  try {
    const { data } = await apiClient.patch(`/courses/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteCourse(id: number): Promise<void> {
  try {
    await apiClient.delete(`/courses/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
