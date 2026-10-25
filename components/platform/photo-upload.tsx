"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toApiError } from "@/lib/api-error";
import { useUploadMediaMutation } from "@/queries/upload.queries";

export interface PhotoUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  folder?: "faculty" | "testimonials" | "banners" | "gallery" | "blog" | "common";
  variant?: "avatar" | "landscape";
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
}

export function PhotoUpload({
  label = "Photo",
  value = "",
  onChange,
  folder = "faculty",
  variant = "avatar",
  required = false,
  disabled = false,
  error,
  hint = "PNG, JPG, or WebP portrait recommended (up to 15MB)",
  placeholder = "https://... or /storage/...",
  className = "",
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const uploadMutation = useUploadMediaMutation({
    onError: (err) => {
      toast.error(toApiError(err).message || "Failed to upload photo.");
    },
  });

  const isUploading = uploadMutation.isPending;
  const isBusy = disabled || isUploading;
  const currentImage = value?.trim() || "";

  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadMutation.mutateAsync({
        file,
        folder,
      });
      onChange(response.url);
      toast.success("Photo uploaded successfully.");
    } catch {
      // Error handled in uploadMutation.onError
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className={`space-y-1.5 w-full min-w-0 ${className}`}>
      {label && (
        <Label className={error ? "text-destructive" : ""}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isBusy}
      />

      {currentImage ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 w-full min-w-0 overflow-hidden">
          {variant === "avatar" ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-border shadow-sm">
              <Image
                src={currentImage}
                alt={label || "Uploaded photo"}
                fill
                className="object-cover"
                unoptimized={
                  currentImage.startsWith("/storage") ||
                  currentImage.startsWith("http")
                }
              />
            </div>
          ) : (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-background shadow-xs">
              <Image
                src={currentImage}
                alt={label || "Uploaded photo"}
                fill
                className="object-cover"
                unoptimized={
                  currentImage.startsWith("/storage") ||
                  currentImage.startsWith("http")
                }
              />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
            <p className="truncate text-xs font-mono text-muted-foreground w-full" title={currentImage}>
              {currentImage}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="h-7 text-xs gap-1.5"
              >
                <Upload className="h-3 w-3" />
                Replace Photo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange("");
                  setShowManualUrl(false);
                }}
                disabled={isBusy}
                className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
              >
                <X className="h-3 w-3" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-colors w-full min-w-0 ${
            isDragging
              ? "border-primary bg-primary/5"
              : error
              ? "border-destructive/60 bg-destructive/5 hover:border-destructive"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-2">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-xs font-medium text-foreground">
                Uploading photo...
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">
                  Click to upload photo or drag & drop
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {hint}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-0.5">
        <button
          type="button"
          onClick={() => setShowManualUrl((v) => !v)}
          className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          {showManualUrl ? "Hide manual URL" : "Or enter photo URL manually"}
        </button>
      </div>

      {showManualUrl && (
        <div className="pt-1 w-full min-w-0">
          <Input
            value={currentImage}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="text-xs font-mono w-full min-w-0 truncate"
            disabled={isBusy}
          />
        </div>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
