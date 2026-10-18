export interface AdmissionSubmissionItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dob?: string | null;
  qualification?: string | null;
  course?: string | null;
  targetExam?: string | null;
  city?: string | null;
  message?: string | null;
  applicationId: string;
  handled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdmissionSubmissionsResponse {
  items: AdmissionSubmissionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdmissionSubmissionQueryParams {
  page?: number;
  limit?: number;
  handled?: boolean | "all";
  search?: string;
  targetExam?: string;
  course?: string;
}
