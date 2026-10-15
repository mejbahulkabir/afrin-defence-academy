"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  Copy,
  GraduationCap,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { toApiError } from "@/lib/api-error";
import type { AdmissionSubmissionItem } from "@/types/admission";
import {
  admissionSubmissionSchema,
  type AdmissionSubmissionInput,
} from "@/validations/admission.schema";
import { useSubmitAdmissionMutation } from "@/queries/admission.queries";

const QUALIFICATIONS = [
  "Class 10th Appearing",
  "Class 10th Passed",
  "Class 11th Studying",
  "Class 12th Appearing",
  "Class 12th Passed",
  "Undergraduate (1st / 2nd / 3rd Year)",
  "Graduate / Final Year",
  "Post Graduate",
];

const TARGET_EXAMS = [
  "NDA (National Defence Academy)",
  "CDS (Combined Defence Services)",
  "AFCAT (Air Force Common Admission Test)",
  "SSB Interview Guidance (All Entries)",
  "CAPF AC (Central Armed Police Forces)",
  "INET / Indian Navy",
  "Territorial Army (TA)",
  "Other Defence Examinations",
];

const PREFERRED_COURSES = [
  "NDA 2-Year Integrated Foundation (Class 11th + NDA)",
  "NDA 1-Year Intensive Foundation (Class 12th / Passed)",
  "CDS Comprehensive Written + SSB Batch",
  "AFCAT 90-Day Tactical Fast-Track",
  "SSB 14-Day Full Immersion Capsule (GTO + Psych + Interview)",
  "One-Year Comprehensive Defence Hybrid Course",
  "Weekend Cadet Training Batch",
];

export default function AdmissionForm() {
  const [submittedData, setSubmittedData] =
    useState<AdmissionSubmissionItem | null>(null);
  const [copied, setCopied] = useState(false);

  const submitMutation = useSubmitAdmissionMutation({
    onSuccess: (data) => {
      setSubmittedData(data);
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(
        toApiError(error).message ||
          "Failed to submit application. Please check your inputs.",
      );
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdmissionSubmissionInput>({
    resolver: zodResolver(admissionSubmissionSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      qualification: "",
      course: "",
      targetExam: "",
      city: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: AdmissionSubmissionInput) => {
    submitMutation.mutate(values);
  };

  const isPending = submitMutation.isPending;

  const handleCopyId = () => {
    if (submittedData?.applicationId) {
      navigator.clipboard.writeText(submittedData.applicationId);
      setCopied(true);
      toast.success("Application ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetForm = () => {
    reset();
    setSubmittedData(null);
  };

  // If successfully submitted, display rich success acknowledgment
  if (submittedData) {
    return (
      <Card className="lg:col-span-3 border-emerald-500/30 bg-card shadow-elegant overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <div className="space-y-1.5">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-none mb-1 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Submission Confirmed
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Application Received!
            </h2>
            <p className="text-white/85 text-xs sm:text-sm max-w-xl">
              Thank you, <span className="font-semibold">{submittedData.fullName}</span>. Your application for admission has been registered in the academy portal.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <ShieldCheck className="h-9 w-9 text-white" />
            </span>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Application Reference ID Box */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Official Application ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-primary block mt-0.5">
                {submittedData.applicationId}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Quote this reference number for all future counseling and admission correspondence.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="gap-1.5 shrink-0 text-xs self-start sm:self-center"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Reference ID
                </>
              )}
            </Button>
          </div>

          {/* Application Summary Grid */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-lg border bg-muted/20 p-3">
              <span className="text-muted-foreground block">Registered Candidate</span>
              <span className="font-semibold text-foreground text-sm block mt-0.5">
                {submittedData.fullName}
              </span>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <span className="text-muted-foreground block">Contact Number</span>
              <span className="font-semibold text-foreground text-sm block mt-0.5 font-mono">
                {submittedData.phone}
              </span>
            </div>
            {submittedData.targetExam && (
              <div className="rounded-lg border bg-muted/20 p-3">
                <span className="text-muted-foreground block">Target Exam</span>
                <span className="font-semibold text-foreground text-sm block mt-0.5">
                  {submittedData.targetExam}
                </span>
              </div>
            )}
            {submittedData.course && (
              <div className="rounded-lg border bg-muted/20 p-3">
                <span className="text-muted-foreground block">Preferred Course</span>
                <span className="font-semibold text-foreground text-sm block mt-0.5">
                  {submittedData.course}
                </span>
              </div>
            )}
          </div>

          {/* Next Steps Guidance */}
          <div className="space-y-3 pt-2 border-t">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" />
              What Happens Next?
            </h3>
            <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-foreground">Admissions Review:</strong> Our academic team verifies your eligibility against official UPSC / Armed Forces guidelines.
              </li>
              <li>
                <strong className="text-foreground">Counselor Call:</strong> A senior mentor will call your number ({submittedData.phone}) within 24 hours to schedule your diagnostic assessment.
              </li>
              <li>
                <strong className="text-foreground">Seat Allotment:</strong> Classroom batch and hostel room reservations will be finalized upon confirmation.
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleResetForm}
              className="text-xs"
            >
              Submit Another Application
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <a href="/">Back to Homepage</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
            <GraduationCap className="h-3 w-3 mr-1" />
            Session 2025–2026
          </Badge>
        </div>
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Admission Application Form
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in your details below to apply for upcoming classroom & residential defence batches.
        </p>
      </div>

      {/* Candidate Personal Details */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent border-b pb-1">
          1. Personal Information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="e.g. Rahul Sharma"
              aria-invalid={!!errors.fullName}
              disabled={isPending}
              className="mt-1.5"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="e.g. rahul.sharma@example.com"
              aria-invalid={!!errors.email}
              disabled={isPending}
              className="mt-1.5"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Mobile Phone */}
          <div>
            <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
              Mobile / WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="e.g. +91 9876543210"
              aria-invalid={!!errors.phone}
              disabled={isPending}
              className="mt-1.5"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              {...register("dob")}
              disabled={isPending}
              className="mt-1.5"
            />
          </div>

          {/* City / State */}
          <div>
            <Label htmlFor="city">City / Home State</Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="e.g. Dehradun, Uttarakhand"
              disabled={isPending}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Academic & Defence Goals */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent border-b pb-1">
          2. Academic & Target Course Details
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Target Exam */}
          <div>
            <Label htmlFor="targetExam">Target Defence Examination</Label>
            <select
              id="targetExam"
              {...register("targetExam")}
              disabled={isPending}
              className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select target exam...</option>
              {TARGET_EXAMS.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          {/* Current Qualification */}
          <div>
            <Label htmlFor="qualification">Current Educational Qualification</Label>
            <select
              id="qualification"
              {...register("qualification")}
              disabled={isPending}
              className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select qualification...</option>
              {QUALIFICATIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Course */}
        <div>
          <Label htmlFor="course">Preferred Academy Batch / Program</Label>
          <select
            id="course"
            {...register("course")}
            disabled={isPending}
            className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select preferred batch...</option>
            {PREFERRED_COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Queries / Message */}
        <div>
          <Label htmlFor="message">
            Specific Questions or Preparation Queries{" "}
            <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="message"
            rows={3}
            {...register("message")}
            placeholder="Tell us about your previous attempts, hostel requirement, or specific questions about the batch..."
            disabled={isPending}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto min-w-[200px] gap-2 h-11 text-sm font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Admission Application
            </>
          )}
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          🔒 Your personal details are protected and will only be used for admission counseling and official academy communication.
        </p>
      </div>
    </form>
  );
}
