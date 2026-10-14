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
import type { TestimonialItem } from "@/types/testimonial";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/validations/testimonials.schema";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/queries/testimonials.queries";

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
    formState: { errors },
  } = useForm<z.input<typeof testimonialSchema>, unknown, TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      achievement: "",
      batch: "",
      quote: "",
      initials: "",
      order: 0,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          name: itemToEdit.name,
          achievement: itemToEdit.achievement ?? "",
          batch: itemToEdit.batch ?? "",
          quote: itemToEdit.quote,
          initials: itemToEdit.initials ?? "",
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          name: "",
          achievement: "",
          batch: "",
          quote: "",
          initials: "",
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Testimonial" : "Create New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update cadet details, review quote, or display order."
              : "Add a new cadet success review or recommendation for your academy."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cadet Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="e.g. SLt. Meera Pillai"
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Initials"
              error={errors.initials?.message}
              description="e.g. MP"
            >
              <Input
                {...register("initials")}
                placeholder="MP"
                aria-invalid={!!errors.initials}
                disabled={isPending}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              />
            </Field>

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
              />
            </Field>
          </div>

          <Field label="Quote / Review" required error={errors.quote?.message}>
            <Textarea
              rows={4}
              {...register("quote")}
              placeholder="e.g. The faculty don't just teach — they've lived the life. Every class connected the syllabus to real service."
              aria-invalid={!!errors.quote}
              disabled={isPending}
            />
          </Field>

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
            />
          </Field>

          {/* Action buttons in same row across all screen sizes */}
          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3 sm:space-x-0">
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
    <div className="space-y-1.5">
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
