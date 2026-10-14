export interface TestimonialItem {
  id: number;
  name: string;
  achievement?: string | null;
  batch?: string | null;
  quote: string;
  initials?: string | null;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
