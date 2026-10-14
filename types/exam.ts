export interface ExamItem {
  id: number;
  slug: string;
  name: string;
  full?: string | null;
  branch?: string | null;
  description?: string | null;
  eligibility?: string | null;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
