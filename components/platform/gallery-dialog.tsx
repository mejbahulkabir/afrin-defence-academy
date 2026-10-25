"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
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
import { PhotoUpload } from "./photo-upload";

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

  const isPending = createMutation.isPending || updateMutation.isPending;

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
      } else {
        reset({
          src: "",
          alt: "",
          caption: "",
          active: true,
          order: 0,
        });
      }
    }
  }, [open, itemToEdit, reset]);

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
          <PhotoUpload
            label="Image Photo"
            required
            value={currentSrc}
            onChange={(url) => setValue("src", url, { shouldValidate: true })}
            folder="gallery"
            variant="landscape"
            disabled={isPending}
            error={errors.src?.message}
            hint="JPG, PNG, WebP, GIF, SVG up to 15MB"
            placeholder="https://example.com/photo.jpg or /storage/gallery/photo.jpg"
          />

          {/* Alt text field */}
          <Field
            label="Alternative Text (Alt Text)"
            error={errors.alt?.message}
            description="Briefly describe what is in the photo for accessibility."
          >
            <Input
              {...register("alt")}
              placeholder="e.g. Cadets during morning drill parade at academy ground"
              aria-invalid={!!errors.alt}
              disabled={isPending}
            />
          </Field>

          {/* Caption field */}
          <Field
            label="Caption / Description"
            error={errors.caption?.message}
            description="Optional short description shown in lightbox or tooltip."
          >
            <Textarea
              rows={2}
              {...register("caption")}
              placeholder="e.g. Annual Passing Out Parade — Batch of 2025"
              aria-invalid={!!errors.caption}
              disabled={isPending}
            />
          </Field>

          {/* Display Order & Active status */}
          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <Field
              label="Display Order"
              error={errors.order?.message}
              description="Lower numbers appear first."
            >
              <Input
                type="number"
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                aria-invalid={!!errors.order}
                disabled={isPending}
              />
            </Field>

            <div className="space-y-1.5 flex flex-col justify-center pt-2 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("active")}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium leading-none">
                  Visible in public gallery
                </span>
              </label>
              <p className="text-[11px] text-muted-foreground pl-6">
                Uncheck to temporarily hide from gallery.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Saving changes..."
                  : "Adding to gallery..."
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
