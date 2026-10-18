import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type { TestimonialItem } from "@/types/testimonial";
import type {
  PatchTestimonialInput,
  TestimonialInput,
} from "@/validations/testimonials.schema";

export async function getTestimonialsList(): Promise<TestimonialItem[]> {
  try {
    const { data } = await apiClient.get("/testimonials");
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createTestimonial(
  values: TestimonialInput
): Promise<TestimonialItem> {
  try {
    const { data } = await apiClient.post("/testimonials", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateTestimonial({
  id,
  data: values,
}: {
  id: number;
  data: PatchTestimonialInput;
}): Promise<TestimonialItem> {
  try {
    const { data } = await apiClient.patch(`/testimonials/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteTestimonial(id: number): Promise<void> {
  try {
    await apiClient.delete(`/testimonials/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
