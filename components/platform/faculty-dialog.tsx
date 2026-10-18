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
import { Label } from "@/components/ui/label";

import { toApiError } from "@/lib/api-error";
import type { FacultyItem } from "@/types/faculty";
import {
  facultySchema,
  type FacultyInput,
} from "@/validations/faculty.schema";
import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
} from "@/queries/faculty.queries";

interface FacultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: FacultyItem | null;
}

export function FacultyDialog({
  open,
  onOpenChange,
  itemToEdit,
}: FacultyDialogProps) {
  const isEditing = !!itemToEdit;

  const createMutation = useCreateFacultyMutation({
    onSuccess: () => {
      toast.success("Faculty member added successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateFacultyMutation({
    onSuccess: () => {
      toast.success("Faculty member updated successfully.");
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
  } = useForm<z.input<typeof facultySchema>, unknown, FacultyInput>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      role: "",
      rank: "",
      experience: "",
      specialization: "",
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
          role: itemToEdit.role,
          rank: itemToEdit.rank ?? "",
          experience: itemToEdit.experience ?? "",
          specialization: itemToEdit.specialization ?? "",
          initials: itemToEdit.initials ?? "",
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          name: "",
          role: "",
          rank: "",
          experience: "",
          specialization: "",
          initials: "",
          order: 0,
        });
      }
    }
  }, [open, itemToEdit, reset]);

  const onSubmit = (values: FacultyInput) => {
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
            {isEditing ? "Edit Faculty Member" : "Add Faculty Member"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update details, credentials, or display order for this mentor."
              : "Add a faculty mentor, retired officer, or subject expert to your academy roster."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="e.g. Col. Arvind Mehra (Retd.)"
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
            </Field>

            <Field label="Role / Title" required error={errors.role?.message}>
              <Input
                {...register("role")}
                placeholder="e.g. Director & SSB Mentor"
                aria-invalid={!!errors.role}
                disabled={isPending}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Branch / Rank"
              error={errors.rank?.message}
              description="e.g. Indian Army, Indian Air Force"
            >
              <Input
                {...register("rank")}
                placeholder="Indian Army"
                aria-invalid={!!errors.rank}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Experience"
              error={errors.experience?.message}
              description="e.g. 32+ yrs, 18 yrs"
            >
              <Input
                {...register("experience")}
                placeholder="32+ yrs"
                aria-invalid={!!errors.experience}
                disabled={isPending}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Field
                label="Specialization"
                error={errors.specialization?.message}
                description="e.g. SSB Interview · Officer Like Qualities"
              >
                <Input
                  {...register("specialization")}
                  placeholder="e.g. SSB Interview · GTO Tasks"
                  aria-invalid={!!errors.specialization}
                  disabled={isPending}
                />
              </Field>
            </div>

            <div>
              <Field
                label="Initials"
                error={errors.initials?.message}
                description="e.g. AM"
              >
                <Input
                  {...register("initials")}
                  placeholder="AM"
                  aria-invalid={!!errors.initials}
                  disabled={isPending}
                />
              </Field>
            </div>
          </div>

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
                : "Add member"}
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
