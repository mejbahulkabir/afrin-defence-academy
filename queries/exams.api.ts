import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { ExamItem } from "@/types/exam";
import type {
  ExamInput,
  PatchExamInput,
} from "@/validations/exams.schema";

export async function getExamsList(): Promise<ExamItem[]> {
  try {
    const { data } = await apiClient.get("/exams");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createExam(values: ExamInput): Promise<ExamItem> {
  try {
    const { data } = await apiClient.post("/exams", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateExam({
  id,
  data: values,
}: {
  id: number;
  data: PatchExamInput;
}): Promise<ExamItem> {
  try {
    const { data } = await apiClient.patch(`/exams/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteExam(id: number): Promise<void> {
  try {
    await apiClient.delete(`/exams/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
