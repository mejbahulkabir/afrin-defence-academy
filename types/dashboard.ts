import type { AdmissionSubmissionItem } from "./admission";
import type { ContactSubmissionItem } from "./contact";

export interface DashboardOverviewCounts {
  courses: number;
  exams: number;
  faculty: number;
  testimonials: number;
  blogPosts: number;
  galleryImages: number;
  banners: number;
  contactSubmissions: number;
  contactPending: number;
  admissionSubmissions: number;
  admissionPending: number;
}

export interface DashboardOverviewResponse {
  counts: DashboardOverviewCounts;
  recentContacts: ContactSubmissionItem[];
  recentAdmissions: AdmissionSubmissionItem[];
}
