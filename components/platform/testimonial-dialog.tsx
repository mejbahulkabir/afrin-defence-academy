"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { ExternalLink, Play } from "lucide-react";

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
import type { TestimonialItem } from "@/types/testimonial";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/validations/testimonials.schema";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/queries/testimonials.queries";
import { PhotoUpload } from "./photo-upload";
import { getYouTubeId } from "@/lib/utils";

export { getYouTubeId };

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: TestimonialItem | null;
}

export function TestimonialDialog({
  open,
  onOpenChange,
  itemToEdit,
}: TestimonialDialogProps) {
  const isEditing = !!itemToEdit;

  const createMutation = useCreateTestimonialMutation({
    onSuccess: () => {
      toast.success("Testimonial created successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateTestimonialMutation({
    onSuccess: () => {
      toast.success("Testimonial updated successfully.");
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
  } = useForm<z.input<typeof testimonialSchema>, unknown, TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      achievement: "",
      batch: "",
      quote: "",
      youtubeUrl: "",
      image: "",
      order: 0,
    },
    mode: "onTouched",
  });

  const currentImage = watch("image");
  const watchedYoutubeUrl = watch("youtubeUrl");
  const youTubeId = getYouTubeId(watchedYoutubeUrl);

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          name: itemToEdit.name,
          achievement: itemToEdit.achievement ?? "",
          batch: itemToEdit.batch ?? "",
          quote: itemToEdit.quote,
          youtubeUrl: itemToEdit.youtubeUrl ?? "",
          image: itemToEdit.image ?? "",
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          name: "",
          achievement: "",
          batch: "",
          quote: "",
          youtubeUrl: "",
          image: "",
          order: 0,
        });
      }
    }
  }, [open, itemToEdit, reset]);

  const onSubmit = (values: TestimonialInput) => {
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
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Testimonial" : "Create New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update cadet details, photo, review quote, video link, or display order."
              : "Add a new cadet success review, photo, or recommendation for your academy."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2 w-full min-w-0 overflow-x-hidden"
        >
          {/* Photo Upload Section */}
          <PhotoUpload
            label="Cadet Photo"
            value={currentImage}
            onChange={(url) => setValue("image", url, { shouldValidate: true })}
            folder="testimonials"
            disabled={isPending}
            error={errors.image?.message}
            hint="PNG, JPG, or WebP portrait recommended (up to 15MB)"
            placeholder="https://... or /storage/testimonials/..."
          />

          <div className="w-full min-w-0">
            <Field label="Cadet Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="e.g. SLt. Meera Pillai"
                aria-invalid={!!errors.name}
                disabled={isPending}
                className="w-full min-w-0"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <div className="min-w-0">
              <Field
                label="Achievement / Rank"
                error={errors.achievement?.message}
                description="e.g. Commissioned — INA Ezhimala"
              >
                <Input
                  {...register("achievement")}
                  placeholder="e.g. AIR 42, NDA 151"
                  aria-invalid={!!errors.achievement}
                  disabled={isPending}
                  className="w-full min-w-0"
                />
              </Field>
            </div>

            <div className="min-w-0">
              <Field
                label="Batch / Exam"
                error={errors.batch?.message}
                description="e.g. CDS 1/2023"
              >
                <Input
                  {...register("batch")}
                  placeholder="e.g. CDS 1/2023"
                  aria-invalid={!!errors.batch}
                  disabled={isPending}
                  className="w-full min-w-0"
                />
              </Field>
            </div>
          </div>

          {/* YouTube Video Link */}
          <div className="w-full min-w-0 space-y-2">
            <Field
              label="YouTube Video Link"
              error={errors.youtubeUrl?.message}
              description="Optional cadet interview or video recommendation link"
            >
              <div className="relative w-full min-w-0">
                <Input
                  {...register("youtubeUrl")}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  aria-invalid={!!errors.youtubeUrl}
                  disabled={isPending}
                  className="w-full min-w-0 font-mono text-xs pr-9"
                />
                {watchedYoutubeUrl && (
                  <a
                    href={watchedYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-600 transition-colors"
                    title="Open YouTube video link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Field>

            {youTubeId && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2 text-xs w-full min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                  <Play className="h-3 w-3 fill-white ml-0.5" />
                </div>
                <span className="truncate flex-1 text-muted-foreground">
                  YouTube ID: <span className="font-mono font-medium text-foreground">{youTubeId}</span>
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${youTubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-medium text-[11px] shrink-0"
                >
                  Preview <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          <div className="w-full min-w-0">
            <Field label="Quote / Review" required error={errors.quote?.message}>
              <Textarea
                rows={4}
                {...register("quote")}
                placeholder="e.g. The faculty don't just teach — they've lived the life. Every class connected the syllabus to real service."
                aria-invalid={!!errors.quote}
                disabled={isPending}
                className="w-full min-w-0"
              />
            </Field>
          </div>

          <div className="w-full min-w-0">
            <Field
              label="Display order"
              error={errors.order?.message}
              description="Lower numbers display first on the website (e.g. 0, 1, 2)."
            >
              <Input
                type="number"
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                aria-invalid={!!errors.order}
                disabled={isPending}
                className="w-full min-w-0"
              />
            </Field>
          </div>

          {/* Action buttons */}
          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3 sm:space-x-0 w-full min-w-0">
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
                : "Create testimonial"}
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
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
