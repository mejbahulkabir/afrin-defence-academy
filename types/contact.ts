export interface ContactSubmissionItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject?: string | null;
  message?: string | null;
  handled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ContactSubmissionsResponse {
  items: ContactSubmissionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContactSubmissionQueryParams {
  page?: number;
  limit?: number;
  handled?: boolean | "all";
  search?: string;
}
