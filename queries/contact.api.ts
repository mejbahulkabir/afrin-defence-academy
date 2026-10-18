import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type {
  ContactSubmissionItem,
  ContactSubmissionQueryParams,
  ContactSubmissionsResponse,
} from "@/types/contact";
import type {
  ContactSubmissionInput,
  PatchContactSubmissionInput,
} from "@/validations/contact.schema";

// Public: Submit contact form
export async function submitContactForm(
  values: ContactSubmissionInput,
): Promise<ContactSubmissionItem> {
  try {
    const { data } = await apiClient.post("/submissions/contact", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

// Admin: Get paginated submissions list
export async function getContactSubmissions(
  params?: ContactSubmissionQueryParams,
): Promise<ContactSubmissionsResponse> {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.handled !== undefined && params.handled !== "all") {
      queryParams.handled = String(params.handled);
    }
    if (params?.search) queryParams.search = params.search;

    const { data } = await apiClient.get("/submissions/contact", {
      params: queryParams,
    });
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

// Admin: Update submission (e.g. mark as handled)
export async function updateContactSubmission({
  id,
  data: values,
}: {
  id: number;
  data: PatchContactSubmissionInput;
}): Promise<ContactSubmissionItem> {
  try {
    const { data } = await apiClient.patch(`/submissions/contact/${id}`, values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

// Admin: Delete submission
export async function deleteContactSubmission(id: number): Promise<void> {
  try {
    await apiClient.delete(`/submissions/contact/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
