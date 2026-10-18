"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { toApiError } from "@/lib/api-error";
import type { GalleryImageItem } from "@/types/gallery";
import {
  gallerySchema,
  type GalleryInput,
} from "@/validations/gallery.schema";
import {
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
} from "@/queries/gallery.queries";
import { useUploadMediaMutation } from "@/queries/upload.queries";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: GalleryImageItem | null;
}

export function GalleryDialog({
  open,
  onOpenChange,
  itemToEdit,
}: GalleryDialogProps) {
  const isEditing = !!itemToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const createMutation = useCreateGalleryMutation({
    onSuccess: () => {
      toast.success("Gallery image added successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateGalleryMutation({
    onSuccess: () => {
      toast.success("Gallery image updated successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const uploadMutation = useUploadMediaMutation({
    onError: (error) => {
      toast.error(toApiError(error).message || "Failed to upload image.");
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof gallerySchema>, unknown, GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      src: "",
      alt: "",
      caption: "",
      active: true,
      order: 0,
    },
    mode: "onTouched",
  });

  const currentSrc = watch("src");

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          src: itemToEdit.src,
          alt: itemToEdit.alt ?? "",
          caption: itemToEdit.caption ?? "",
          active: itemToEdit.active,
          order: itemToEdit.order ?? 0,
        });
        setShowManualUrl(false);
      } else {
        reset({
          src: "",
          alt: "",
          caption: "",
          active: true,
          order: 0,
        });
        setShowManualUrl(false);
      }
    }
  }, [open, itemToEdit, reset]);

  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadMutation.mutateAsync({
        file,
        folder: "gallery",
      });
      setValue("src", response.url, { shouldValidate: true });
      toast.success("Image uploaded successfully.");
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

  const onSubmit = (values: GalleryInput) => {
    if (isEditing && itemToEdit) {
      updateMutation.mutate({
        id: itemToEdit.id,
        data: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Gallery Image" : "Add Image to Gallery"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update image caption, description, order, or change the photo."
              : "Upload a photograph to showcase in your academy gallery."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2 w-full min-w-0 max-w-full overflow-hidden"
        >
          {/* Image Upload / Preview Area */}
          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <Label className={errors.src ? "text-destructive" : ""}>
                Image Photo <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={() => setShowManualUrl((prev) => !prev)}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                <LinkIcon className="h-3 w-3" />
                {showManualUrl ? "Upload File instead" : "Enter Image URL"}
              </button>
            </div>

            {/* Manual URL input toggle */}
            {showManualUrl && (
              <Field
                label="Direct Image URL"
                error={errors.src?.message}
                description="Enter a direct image URL or relative path (e.g. /storage/gallery/photo.jpg)"
              >
                <Input
                  {...register("src")}
                  placeholder="https://example.com/photo.jpg or /storage/gallery/photo.jpg"
                  aria-invalid={!!errors.src}
                  disabled={isPending}
                />
              </Field>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
              className="hidden"
              onChange={handleFileChange}
              disabled={isPending}
            />

            {/* Image Preview or Dropzone */}
            {currentSrc ? (
              <div className="relative rounded-xl border bg-muted/30 p-3 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full min-w-0 max-w-full">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSrc}
                    alt="Gallery item preview"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {uploadMutation.isPending && (
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 w-full space-y-1.5 text-center sm:text-left overflow-hidden">
                  <p
                    className="text-xs font-mono text-muted-foreground truncate block max-w-full"
                    title={currentSrc}
                  >
                    {currentSrc}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Image selected
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isPending}
                      className="h-7 text-xs gap-1"
                    >
                      <Upload className="h-3 w-3" />
                      Replace Image
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue("src", "", { shouldValidate: true })}
                      disabled={isPending}
                      className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
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
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors w-full min-w-0 ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : errors.src
                    ? "border-destructive/60 bg-destructive/5 hover:border-destructive"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center space-y-2 py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs font-medium text-foreground">
                      Uploading to storage...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag & drop image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP, GIF, SVG up to 15MB
                    </p>
                  </>
                )}
              </div>
            )}

            {errors.src && (
              <p className="text-xs font-medium text-destructive">
                {errors.src.message}
              </p>
            )}
          </div>

          {/* Caption */}
          <Field
            label="Caption"
            error={errors.caption?.message}
            description="Brief description shown under or over the image."
          >
            <Textarea
              rows={2}
              {...register("caption")}
              placeholder="e.g. Cadets attending tactical physical endurance session on obstacle course"
              aria-invalid={!!errors.caption}
              disabled={isPending}
            />
          </Field>

          {/* Alt text */}
          <Field
            label="Alt Text (SEO & Accessibility)"
            error={errors.alt?.message}
            description="Descriptive text for screen readers and SEO indexing."
          >
            <Input
              {...register("alt")}
              placeholder="e.g. Cadets navigating the high-wall obstacle course"
              aria-invalid={!!errors.alt}
              disabled={isPending}
            />
          </Field>

          {/* Order and Active status */}
          <div className="grid gap-4 sm:grid-cols-2 items-start w-full min-w-0">
            <Field
              label="Display order"
              error={errors.order?.message}
              description="Lower numbers display first (e.g. 0, 1, 2)."
            >
              <Input
                type="number"
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                aria-invalid={!!errors.order}
                disabled={isPending}
              />
            </Field>

            <div className="pt-2 sm:pt-7">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("active")}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary shrink-0"
                />
                <span className="text-sm font-medium text-foreground">
                  Active (Visible on website)
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Uncheck to hide this image without deleting it.
              </p>
            </div>
          </div>

          {/* Action buttons in same row across all screen sizes */}
          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3 sm:space-x-0 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                ? "Save changes"
                : "Add to gallery"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  required,
  error,
  description,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  description?: string;
}) {
  return (
    <div className="space-y-1.5 w-full min-w-0">
      <Label className={error ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {children}

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
