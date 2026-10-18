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
import type { WhyUsItem } from "@/types/why-us";
import { whyUsSchema, type WhyUsInput } from "@/validations/why-us.schema";
import {
  useCreateWhyUsMutation,
  useUpdateWhyUsMutation,
} from "@/queries/why-us.queries";

interface WhyUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: WhyUsItem | null;
}

export function WhyUsDialog({
  open,
  onOpenChange,
  itemToEdit,
}: WhyUsDialogProps) {
  const isEditing = !!itemToEdit;

  const createMutation = useCreateWhyUsMutation({
    onSuccess: () => {
      toast.success("Why Us item created successfully.");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateWhyUsMutation({
    onSuccess: () => {
      toast.success("Why Us item updated successfully.");
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
  } = useForm<z.input<typeof whyUsSchema>, unknown, WhyUsInput>({
    resolver: zodResolver(whyUsSchema),
    defaultValues: {
      title: "",
      desc: "",
      order: 0,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          title: itemToEdit.title,
          desc: itemToEdit.desc,
          order: itemToEdit.order ?? 0,
        });
      } else {
        reset({
          title: "",
          desc: "",
          order: 0,
        });
      }
    }
  }, [open, itemToEdit, reset]);

  const onSubmit = (values: WhyUsInput) => {
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
            {isEditing ? "Edit Why Us Item" : "Create New Why Us Item"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the title, description, or display order of this reason."
              : "Add a key highlight explaining why students should choose your academy."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <Field label="Title" required error={errors.title?.message}>
            <Input
              {...register("title")}
              placeholder="e.g. Ex-Defence Faculty"
              aria-invalid={!!errors.title}
              disabled={isPending}
            />
          </Field>

          <Field label="Description" required error={errors.desc?.message}>
            <Textarea
              rows={4}
              {...register("desc")}
              placeholder="e.g. Officers from Army, Navy and Air Force — not theory, lived experience."
              aria-invalid={!!errors.desc}
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

          {/* Action buttons kept in the same row on all screen sizes */}
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
                : "Create item"}
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
