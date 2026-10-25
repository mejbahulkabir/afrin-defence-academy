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
import type { BannerItem } from "@/types/banner";
import {
  bannerSchema,
  type BannerInput,
} from "@/validations/banners.schema";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/queries/banners.queries";
import { PhotoUpload } from "./photo-upload";

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

  const isPending = createMutation.isPending || updateMutation.isPending;

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
      }
    }
  }, [open, itemToEdit, reset]);

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

          {/* Banner Image */}
          <PhotoUpload
            label="Banner Image"
            required
            value={currentImage}
            onChange={(url) => setValue("image", url, { shouldValidate: true })}
            folder="banners"
            variant="landscape"
            disabled={isPending}
            error={errors.image?.message}
            hint="Wide banner image recommended (1920x1080 or 16:9, up to 15MB)"
            placeholder="https://example.com/banner.jpg or /storage/banners/..."
          />



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
