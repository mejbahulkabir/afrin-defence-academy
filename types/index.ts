export interface Course {
  slug: string;
  title: string;
  duration: string;
  mode: "Online" | "Offline" | "Hybrid";
  level: "Foundation" | "Intermediate" | "Advanced";
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Exam {
  slug: string;
  name: string;
  full: string;
  branch: string;
  description: string;
  eligibility: string;
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  rank?: string;
  experience: string;
  specialization: string;
  initials: string;
}

export interface Testimonial {
  id: string;
  name: string;
  achievement: string;
  batch: string;
  quote: string;
  initials: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}