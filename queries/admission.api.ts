import { apiClient } from "@/lib/api-client";
import { toApiError } from "@/lib/api-error";
import type {
  AdmissionSubmissionItem,
  AdmissionSubmissionQueryParams,
  AdmissionSubmissionsResponse,
} from "@/types/admission";
import type {
  AdmissionSubmissionInput,
  PatchAdmissionSubmissionInput,
} from "@/validations/admission.schema";

// Public: Submit admission form
export async function submitAdmissionForm(
  values: AdmissionSubmissionInput,
): Promise<AdmissionSubmissionItem> {
  try {
    const { data } = await apiClient.post("/submissions/admission", values);
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

// Admin: Get paginated admission submissions list
export async function getAdmissionSubmissions(
  params?: AdmissionSubmissionQueryParams,
): Promise<AdmissionSubmissionsResponse> {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.handled !== undefined && params.handled !== "all") {
      queryParams.handled = String(params.handled);
    }
    if (params?.search) queryParams.search = params.search;
    if (params?.targetExam) queryParams.targetExam = params.targetExam;
    if (params?.course) queryParams.course = params.course;

    const { data } = await apiClient.get("/submissions/admission", {
      params: queryParams,
    });
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

// Admin: Update submission (e.g. mark as handled)
export async function updateAdmissionSubmission({
  id,
  data: values,
}: {
  id: number;
  data: PatchAdmissionSubmissionInput;
}): Promise<AdmissionSubmissionItem> {
  try {
    const { data } = await apiClient.patch(
      `/submissions/admission/${id}`,
      values,
    );
    return data.data ?? data;
  } catch (error) {
    throw toApiError(error);
  }
}

// Admin: Delete submission
export async function deleteAdmissionSubmission(id: number): Promise<void> {
  try {
    await apiClient.delete(`/submissions/admission/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
