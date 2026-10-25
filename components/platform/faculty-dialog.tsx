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
import { generateInitials } from "@/lib/utils";
import type { FacultyItem } from "@/types/faculty";
import {
  facultySchema,
  type FacultyInput,
} from "@/validations/faculty.schema";
import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
} from "@/queries/faculty.queries";
import { PhotoUpload } from "./photo-upload";

export { generateInitials };

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof facultySchema>, unknown, FacultyInput>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      role: "",
      image: "",
      rank: "",
      experience: "",
      specialization: "",
      order: 0,
    },
    mode: "onTouched",
  });

  const currentImage = watch("image");

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          name: itemToEdit.name,
          role: itemToEdit.role,
          image: itemToEdit.image ?? "",
          rank: itemToEdit.rank ?? "",
          experience: itemToEdit.experience ?? "",
          specialization: itemToEdit.specialization ?? "",
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          name: "",
          role: "",
          image: "",
          rank: "",
          experience: "",
          specialization: "",
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
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
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

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2 w-full min-w-0 overflow-x-hidden"
        >
          {/* Photo Upload Section */}
          <PhotoUpload
            label="Faculty Photo"
            value={currentImage}
            onChange={(url) => setValue("image", url, { shouldValidate: true })}
            folder="faculty"
            disabled={isPending}
            error={errors.image?.message}
            hint="PNG, JPG, or WebP portrait recommended (up to 15MB)"
            placeholder="https://... or /storage/faculty/..."
          />

          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <div className="min-w-0">
              <Field label="Name" required error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="e.g. Col. Arvind Mehra (Retd.)"
                  aria-invalid={!!errors.name}
                  disabled={isPending}
                  className="w-full min-w-0"
                />
              </Field>
            </div>

            <div className="min-w-0">
              <Field label="Role / Title" required error={errors.role?.message}>
                <Input
                  {...register("role")}
                  placeholder="e.g. Director & SSB Mentor"
                  aria-invalid={!!errors.role}
                  disabled={isPending}
                  className="w-full min-w-0"
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
            <div className="min-w-0">
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
                  className="w-full min-w-0"
                />
              </Field>
            </div>

            <div className="min-w-0">
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
                  className="w-full min-w-0"
                />
              </Field>
            </div>
          </div>

          <div className="w-full min-w-0">
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
                  : "Adding..."
                : isEditing
                ? "Save changes"
                : "Add faculty member"}
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
