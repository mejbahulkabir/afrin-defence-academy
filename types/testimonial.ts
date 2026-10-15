export interface Testimonial {
  id?: number | string;
  name: string;
  achievement?: string | null;
  batch?: string | null;
  quote: string;
  initials?: string | null;
  order?: number;
}

export interface TestimonialItem extends Omit<Testimonial, "id"> {
  id: number;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
