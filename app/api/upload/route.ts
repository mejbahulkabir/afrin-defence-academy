import { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return ApiResponse.unauthorized();
    }

    if (!["owner", "admin", "publisher"].includes(session.user.role ?? "")) {
      return ApiResponse.forbidden();
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const rawFolder = formData.get("folder");

    if (!file || !(file instanceof File)) {
      return ApiResponse.badRequest("No file provided for upload.");
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return ApiResponse.badRequest(
        "Invalid file type. Supported formats: JPG, PNG, WebP, GIF, SVG, AVIF, and PDF."
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return ApiResponse.badRequest(
        "File size exceeds the 15MB limit. Please upload a smaller file."
      );
    }

    // Optional sanitized subfolder (e.g. "gallery", or default directly in /public/storage)
    const folder =
      typeof rawFolder === "string"
        ? rawFolder.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30)
        : "";

    const uploadDir = folder
      ? path.join(process.cwd(), "public", "storage", folder)
      : path.join(process.cwd(), "public", "storage");

    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const rawBase = path.basename(file.name, ext);
    const sanitizedBase = rawBase
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const finalFileName = `${sanitizedBase ? `${sanitizedBase}-` : ""}${uniqueId}${ext}`;
    const destinationPath = path.join(uploadDir, finalFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destinationPath, buffer);

    const publicUrl = folder
      ? `/storage/${folder}/${finalFileName}`
      : `/storage/${finalFileName}`;

    return ApiResponse.ok({
      url: publicUrl,
      filename: finalFileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return ApiResponse.internalServerError("Failed to upload file.");
  }
}
