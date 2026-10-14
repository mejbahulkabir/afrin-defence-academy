export interface UploadMediaResponse {
  url: string;
  filename: string;
  size: number;
  type?: string;
}

export interface UploadMediaOptions {
  file: File;
  folder?: string;
}
