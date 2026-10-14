"use client";

import { useEffect, useState, type ReactNode } from "react";
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
import type { CourseItem } from "@/types/course";
import {
  courseSchema,
  type CourseInput,
} from "@/validations/courses.schema";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/queries/courses.queries";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: CourseItem | null;
}

export function CourseDialog({
  open,
  onOpenChange,
  itemToEdit,
}: CourseDialogProps) {
  const isEditing = !!itemToEdit;
  const [featuresText, setFeaturesText] = useState("");

  const createMutation = useCreateCourseMutation({
    onSuccess: () => {
      toast.success("Course created successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateCourseMutation({
    onSuccess: () => {
      toast.success("Course updated successfully.");
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
  } = useForm<z.input<typeof courseSchema>, unknown, CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      slug: "",
      duration: "",
      mode: "Hybrid",
      level: "Foundation",
      description: "",
      features: [],
      popular: false,
      order: 0,
    },
    mode: "onTouched",
  });

  const titleValue = watch("title");

  const handleTitleBlur = () => {
    if (!isEditing && titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          title: itemToEdit.title,
          slug: itemToEdit.slug,
          duration: itemToEdit.duration ?? "",
          mode: itemToEdit.mode,
          level: itemToEdit.level,
          description: itemToEdit.description ?? "",
          features: itemToEdit.features ?? [],
          popular: itemToEdit.popular,
          order: itemToEdit.order ?? 0,
        });
        setFeaturesText(itemToEdit.features?.join("\n") ?? "");
      } else {
        reset({
          title: "",
          slug: "",
          duration: "",
          mode: "Hybrid",
          level: "Foundation",
          description: "",
          features: [],
          popular: false,
          order: 0,
        });
        setFeaturesText("");
      }
    }
  }, [open, itemToEdit, reset]);

  const onSubmit = (values: CourseInput) => {
    // Parse newline-separated features
    const parsedFeatures = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: CourseInput = {
      ...values,
      features: parsedFeatures,
    };

    if (isEditing && itemToEdit) {
      updateMutation.mutate({
        id: itemToEdit.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update program curriculum, duration, delivery mode, or syllabus highlights."
              : "Add a defence coaching batch or training program to your academy."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course Title" required error={errors.title?.message}>
              <Input
                {...register("title")}
                onBlur={handleTitleBlur}
                placeholder="e.g. NDA Foundation Program"
                aria-invalid={!!errors.title}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Slug"
              required
              error={errors.slug?.message}
              description="e.g. nda-foundation"
            >
              <Input
                {...register("slug")}
                placeholder="nda-foundation"
                aria-invalid={!!errors.slug}
                disabled={isPending}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Duration"
              error={errors.duration?.message}
              description="e.g. 12 Months, 6 Months"
            >
              <Input
                {...register("duration")}
                placeholder="12 Months"
                aria-invalid={!!errors.duration}
                disabled={isPending}
              />
            </Field>

            <Field label="Mode" required error={errors.mode?.message}>
              <select
                {...register("mode")}
                disabled={isPending}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </Field>

            <Field label="Level" required error={errors.level?.message}>
              <select
                {...register("level")}
                disabled={isPending}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Foundation">Foundation</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
          </div>

          <Field
            label="Key Features"
            description="Enter one feature per line (e.g. Maths + GAT mastery, Weekly mocks)"
          >
            <Textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Maths + GAT mastery&#10;Daily current affairs&#10;Weekly mocks&#10;Personalised SSB mentoring"
              disabled={isPending}
            />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <Textarea
              rows={3}
              {...register("description")}
              placeholder="Complete preparation for National Defence Academy written exam, SSB interview and physical standards."
              aria-invalid={!!errors.description}
              disabled={isPending}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 items-center">
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

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("popular")}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  Mark as Popular / Featured
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Displays a &ldquo;Popular&rdquo; badge on the website.
              </p>
            </div>
          </div>

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
                : "Add course"}
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
