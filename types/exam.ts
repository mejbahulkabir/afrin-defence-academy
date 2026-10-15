export interface Exam {
  id?: number;
  slug: string;
  name: string;
  full?: string | null;
  branch?: string | null;
  description?: string | null;
  eligibility?: string | null;
  order?: number;
}

export interface ExamItem extends Exam {
  id: number;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
