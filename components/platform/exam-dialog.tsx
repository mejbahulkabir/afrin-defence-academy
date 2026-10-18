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
import type { ExamItem } from "@/types/exam";
import {
  examSchema,
  type ExamInput,
} from "@/validations/exams.schema";
import {
  useCreateExamMutation,
  useUpdateExamMutation,
} from "@/queries/exams.queries";

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: ExamItem | null;
}

export function ExamDialog({
  open,
  onOpenChange,
  itemToEdit,
}: ExamDialogProps) {
  const isEditing = !!itemToEdit;

  const createMutation = useCreateExamMutation({
    onSuccess: () => {
      toast.success("Defence exam created successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateExamMutation({
    onSuccess: () => {
      toast.success("Defence exam updated successfully.");
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
  } = useForm<z.input<typeof examSchema>, unknown, ExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
      slug: "",
      full: "",
      branch: "",
      eligibility: "",
      description: "",
      order: 0,
    },
    mode: "onTouched",
  });

  const nameValue = watch("name");

  // Auto-slug generation for new items if slug has not been manually customized
  const handleNameBlur = () => {
    if (!isEditing && nameValue) {
      const generatedSlug = nameValue
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
          name: itemToEdit.name,
          slug: itemToEdit.slug,
          full: itemToEdit.full ?? "",
          branch: itemToEdit.branch ?? "",
          eligibility: itemToEdit.eligibility ?? "",
          description: itemToEdit.description ?? "",
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          name: "",
          slug: "",
          full: "",
          branch: "",
          eligibility: "",
          description: "",
          order: 0,
        });
      }
    }
  }, [open, itemToEdit, reset]);

  const onSubmit = (values: ExamInput) => {
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
            {isEditing ? "Edit Defence Exam" : "Add Defence Exam"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update exam title, branch eligibility, or syllabus details."
              : "Add an entry for a defence competitive examination like NDA, CDS, AFCAT, etc."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Exam Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                onBlur={handleNameBlur}
                placeholder="e.g. NDA & NA"
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Slug"
              required
              error={errors.slug?.message}
              description="URL-friendly identifier (e.g. nda)"
            >
              <Input
                {...register("slug")}
                placeholder="nda"
                aria-invalid={!!errors.slug}
                disabled={isPending}
              />
            </Field>
          </div>

          <Field
            label="Full Title"
            error={errors.full?.message}
            description="e.g. National Defence Academy & Naval Academy"
          >
            <Input
              {...register("full")}
              placeholder="National Defence Academy & Naval Academy"
              aria-invalid={!!errors.full}
              disabled={isPending}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Branch / Forces"
              error={errors.branch?.message}
              description="e.g. Army · Navy · Air Force"
            >
              <Input
                {...register("branch")}
                placeholder="Army · Navy · Air Force"
                aria-invalid={!!errors.branch}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Eligibility Summary"
              error={errors.eligibility?.message}
              description="e.g. 12th passed, 16.5–19.5 yrs"
            >
              <Input
                {...register("eligibility")}
                placeholder="12th passed / appearing, 16.5–19.5 yrs"
                aria-invalid={!!errors.eligibility}
                disabled={isPending}
              />
            </Field>
          </div>

          <Field label="Description" error={errors.description?.message}>
            <Textarea
              rows={3}
              {...register("description")}
              placeholder="Entry-level exam for class 12 students aspiring to be officers in the Indian Armed Forces."
              aria-invalid={!!errors.description}
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
                : "Add exam"}
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
