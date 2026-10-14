export interface GalleryImageItem {
  id: number;
  src: string;
  alt?: string | null;
  caption?: string | null;
  active: boolean;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UploadImageResponse {
  url: string;
  filename: string;
  size: number;
}
