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
import type { StatItem } from "@/types/stats";
import { statSchema, type StatInput } from "@/validations/stats.schema";
import {
  useCreateStatMutation,
  useUpdateStatMutation,
} from "@/queries/stats.queries";

interface StatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: StatItem | null;
}

export function StatDialog({
  open,
  onOpenChange,
  itemToEdit,
}: StatDialogProps) {
  const isEditing = !!itemToEdit;

  const createMutation = useCreateStatMutation({
    onSuccess: () => {
      toast.success("Statistic created successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateStatMutation({
    onSuccess: () => {
      toast.success("Statistic updated successfully.");
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
  } = useForm<z.input<typeof statSchema>, unknown, StatInput>({
    resolver: zodResolver(statSchema),
    defaultValues: {
      label: "",
      value: 0,
      suffix: "",
      order: 0,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          label: itemToEdit.label,
          value: itemToEdit.value,
          suffix: itemToEdit.suffix ?? "",
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          label: "",
          value: 0,
          suffix: "",
          order: 0,
        });
      }
    }
  }, [open, itemToEdit, reset]);

  const onSubmit = (values: StatInput) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Statistic" : "Create New Statistic"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the number, label, suffix, or display order for this statistic."
              : "Add a key achievement number or performance metric to display on your website."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <Field label="Label" required error={errors.label?.message}>
            <Input
              {...register("label")}
              placeholder="e.g. Officers commissioned"
              aria-invalid={!!errors.label}
              disabled={isPending}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Value" required error={errors.value?.message}>
              <Input
                type="number"
                {...register("value", { valueAsNumber: true })}
                placeholder="3200"
                aria-invalid={!!errors.value}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Suffix"
              error={errors.suffix?.message}
              description="e.g. +, %, k"
            >
              <Input
                {...register("suffix")}
                placeholder="+"
                aria-invalid={!!errors.suffix}
                disabled={isPending}
              />
            </Field>
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
                : "Create statistic"}
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
