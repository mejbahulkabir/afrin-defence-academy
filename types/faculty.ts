export interface Faculty {
  id?: number | string;
  name: string;
  role: string;
  image?: string | null;
  rank?: string | null;
  experience?: string | null;
  specialization?: string | null;
  order?: number;
}

export interface FacultyItem extends Omit<Faculty, "id"> {
  id: number;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
