export type CourseMode = "Online" | "Offline" | "Hybrid";
export type CourseLevel = "Foundation" | "Intermediate" | "Advanced";

export interface Course {
  id?: number;
  slug: string;
  title: string;
  duration?: string | null;
  mode: CourseMode;
  level: CourseLevel;
  description?: string | null;
  features: string[];
  popular?: boolean;
  order?: number;
}

export interface CourseItem extends Course {
  id: number;
  popular: boolean;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
