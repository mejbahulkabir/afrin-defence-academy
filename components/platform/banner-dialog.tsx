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
import type { BannerItem } from "@/types/banner";
import {
  bannerSchema,
  type BannerInput,
} from "@/validations/banners.schema";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/queries/banners.queries";
import { useUploadMediaMutation } from "@/queries/upload.queries";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: BannerItem | null;
}

export function BannerDialog({
  open,
  onOpenChange,
  itemToEdit,
}: BannerDialogProps) {
  const isEditing = !!itemToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const createMutation = useCreateBannerMutation({
    onSuccess: () => {
      toast.success("Banner created successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateBannerMutation({
    onSuccess: () => {
      toast.success("Banner updated successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const uploadMutation = useUploadMediaMutation({
    onError: (error) => {
      toast.error(toApiError(error).message || "Failed to upload banner image.");
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
  } = useForm<z.input<typeof bannerSchema>, unknown, BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      slot: "hero",
      image: "",
      eyebrow: "",
      title: "",
      titleHighlight: "",
      subtitle: "",
      ctaLabel: "",
      ctaHref: "",
      secondaryLabel: "",
      secondaryHref: "",
      active: true,
      order: 0,
    },
    mode: "onTouched",
  });

  const currentImage = watch("image");

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          slot: itemToEdit.slot,
          image: itemToEdit.image,
          eyebrow: itemToEdit.eyebrow ?? "",
          title: itemToEdit.title ?? "",
          titleHighlight: itemToEdit.titleHighlight ?? "",
          subtitle: itemToEdit.subtitle ?? "",
          ctaLabel: itemToEdit.ctaLabel ?? "",
          ctaHref: itemToEdit.ctaHref ?? "",
          secondaryLabel: itemToEdit.secondaryLabel ?? "",
          secondaryHref: itemToEdit.secondaryHref ?? "",
          active: itemToEdit.active,
          order: itemToEdit.order ?? 0,
        });
        setShowManualUrl(false);
      } else {
        reset({
          slot: "hero",
          image: "",
          eyebrow: "",
          title: "",
          titleHighlight: "",
          subtitle: "",
          ctaLabel: "",
          ctaHref: "",
          secondaryLabel: "",
          secondaryHref: "",
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
        folder: "banners",
      });
      setValue("image", response.url, { shouldValidate: true });
      toast.success("Banner image uploaded successfully.");
    } catch {
      // Handled in onError
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

  const onSubmit = (values: BannerInput) => {
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
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update banner messaging, call to action links, slot position, or change the photo."
              : "Create a hero carousel slide or call-to-action banner for your website."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2 w-full min-w-0 max-w-full overflow-hidden"
        >
          {/* Banner Slot */}
          <Field
            label="Banner Slot"
            required
            error={errors.slot?.message}
            description="Choose where this banner appears on your website."
          >
            <select
              {...register("slot")}
              disabled={isPending}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="hero">Hero Section (Homepage Slider / Banner)</option>
              <option value="cta">CTA Section (Call To Action Banner)</option>
            </select>
          </Field>

          {/* Image Upload / Preview Area */}
          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <Label className={errors.image ? "text-destructive" : ""}>
                Banner Image <span className="text-destructive">*</span>
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
                error={errors.image?.message}
                description="Enter a direct image URL or relative path (e.g. /storage/banners/hero.webp)"
              >
                <Input
                  {...register("image")}
                  placeholder="https://example.com/banner.jpg or /storage/banners/hero.webp"
                  aria-invalid={!!errors.image}
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
            {currentImage ? (
              <div className="relative rounded-xl border bg-muted/30 p-3 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full min-w-0 max-w-full">
                <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImage}
                    alt="Banner preview"
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
                    title={currentImage}
                  >
                    {currentImage}
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
                      onClick={() => setValue("image", "", { shouldValidate: true })}
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
                    : errors.image
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
                      Click to upload banner image or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      High resolution JPG, PNG, WebP up to 15MB
                    </p>
                  </>
                )}
              </div>
            )}

            {errors.image && (
              <p className="text-xs font-medium text-destructive">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Eyebrow & Title */}
          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <Field
              label="Eyebrow Text"
              error={errors.eyebrow?.message}
              description="Small badge/headline above title (e.g. ADMISSIONS 2026)"
            >
              <Input
                {...register("eyebrow")}
                placeholder="ADMISSIONS OPEN"
                aria-invalid={!!errors.eyebrow}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Title Highlight"
              error={errors.titleHighlight?.message}
              description="Word/phrase styled with highlight color"
            >
              <Input
                {...register("titleHighlight")}
                placeholder="A Commissioned Officer"
                aria-invalid={!!errors.titleHighlight}
                disabled={isPending}
              />
            </Field>
          </div>

          <Field
            label="Banner Title"
            error={errors.title?.message}
            description="Main headline for the banner"
          >
            <Input
              {...register("title")}
              placeholder="Transform Your Passion Into A Commission"
              aria-invalid={!!errors.title}
              disabled={isPending}
            />
          </Field>

          {/* Subtitle */}
          <Field
            label="Subtitle / Description"
            error={errors.subtitle?.message}
            description="Supporting text shown beneath the banner title"
          >
            <Textarea
              rows={2}
              {...register("subtitle")}
              placeholder="Join Eastern India's premier defence coaching academy with unmatched SSB selections."
              aria-invalid={!!errors.subtitle}
              disabled={isPending}
            />
          </Field>

          {/* Primary CTA */}
          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <Field
              label="Primary Button Label"
              error={errors.ctaLabel?.message}
              description="e.g. Apply Online"
            >
              <Input
                {...register("ctaLabel")}
                placeholder="Apply for Admission"
                aria-invalid={!!errors.ctaLabel}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Primary Button Link"
              error={errors.ctaHref?.message}
              description="e.g. /admission or https://..."
            >
              <Input
                {...register("ctaHref")}
                placeholder="/admission"
                aria-invalid={!!errors.ctaHref}
                disabled={isPending}
              />
            </Field>
          </div>

          {/* Secondary CTA */}
          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <Field
              label="Secondary Button Label"
              error={errors.secondaryLabel?.message}
              description="e.g. Explore Programs"
            >
              <Input
                {...register("secondaryLabel")}
                placeholder="View Courses"
                aria-invalid={!!errors.secondaryLabel}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Secondary Button Link"
              error={errors.secondaryHref?.message}
              description="e.g. /courses"
            >
              <Input
                {...register("secondaryHref")}
                placeholder="/courses"
                aria-invalid={!!errors.secondaryHref}
                disabled={isPending}
              />
            </Field>
          </div>

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
                Uncheck to temporarily hide this banner from view.
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
                  : "Creating..."
                : isEditing
                ? "Save changes"
                : "Create banner"}
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
