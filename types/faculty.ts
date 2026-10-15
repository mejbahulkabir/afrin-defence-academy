export interface Faculty {
  id?: number | string;
  name: string;
  role: string;
  rank?: string | null;
  experience?: string | null;
  specialization?: string | null;
  initials?: string | null;
  order?: number;
}

export interface FacultyItem extends Omit<Faculty, "id"> {
  id: number;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
