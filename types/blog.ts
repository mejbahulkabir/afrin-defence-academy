export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  image?: string | null;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  author?: string | null;
  date?: string | null;
  readingTime?: string | null;
  published?: boolean;
}

export interface BlogPostItem extends BlogPost {
  id: number;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
