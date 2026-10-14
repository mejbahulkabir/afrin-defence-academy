export interface FacultyItem {
  id: number;
  name: string;
  role: string;
  rank?: string | null;
  experience?: string | null;
  specialization?: string | null;
  initials?: string | null;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
