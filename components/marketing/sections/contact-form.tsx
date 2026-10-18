"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { toApiError } from "@/lib/api-error";
import {
  contactSubmissionSchema,
  type ContactSubmissionInput,
} from "@/validations/contact.schema";
import { useSubmitContactMutation } from "@/queries/contact.queries";

// Re-exported for backwards compatibility with any existing imports
export { contactSubmissionSchema as contactSchema };
export type ContactFormValues = ContactSubmissionInput;

export default function ContactForm() {
  const submitMutation = useSubmitContactMutation({
    onSuccess: () => {
      toast.success(
        "Message sent successfully! Our admissions team will reply within 24 hours.",
      );
      reset();
    },
    onError: (error) => {
      toast.error(
        toApiError(error).message ||
          "Failed to send your message. Please try again.",
      );
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSubmissionInput>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: ContactSubmissionInput) => {
    submitMutation.mutate(values);
  };

  const isPending = submitMutation.isPending;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
    >
      <h2 className="font-display text-2xl font-semibold text-foreground">
        Send us a message
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Have questions about admissions, SSB coaching batches, or academy facilities? Fill in the details below.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g. Major Vikram Batra"
            aria-invalid={!!errors.name}
            disabled={isPending}
            className="mt-1.5"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="e.g. candidate@example.com"
            aria-invalid={!!errors.email}
            disabled={isPending}
            className="mt-1.5"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="e.g. +91 98765 43210"
            aria-invalid={!!errors.phone}
            disabled={isPending}
            className="mt-1.5"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subject" className={errors.subject ? "text-destructive" : ""}>
            Subject / Query Category
          </Label>
          <Input
            id="subject"
            {...register("subject")}
            placeholder="e.g. NDA Foundation Batch 2026 inquiry"
            aria-invalid={!!errors.subject}
            disabled={isPending}
            className="mt-1.5"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="message" className={errors.message ? "text-destructive" : ""}>
            Your Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            rows={5}
            {...register("message")}
            placeholder="Write your questions or queries here..."
            aria-invalid={!!errors.message}
            disabled={isPending}
            className="mt-1.5"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)] inline-flex items-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending message...
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
