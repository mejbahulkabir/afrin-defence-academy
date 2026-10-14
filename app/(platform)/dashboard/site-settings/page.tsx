"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PageHeader } from "@/components/platform/page-header";

import { toApiError } from "@/lib/api-error";
import {
  useSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} from "@/queries/settings.queries";
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/validations/site-settings.schema";

const defaultValues: SiteSettingsInput = {
  name: "",
  shortName: "",
  tagline: "",
  description: "",
  phone: "",
  phoneRaw: "",
  email: "",
  whatsapp: "",
  address: "",
  mapsEmbed: "",
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: "",
  },
};

export default function SiteSettingsPage() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useSiteSettingsQuery();

  const updateMutation = useUpdateSiteSettingsMutation({
    onSuccess: () => {
      toast.success("Site settings saved successfully.");
    },
    onError: (error: unknown) => {
      toast.error(toApiError(error).message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? "",
        shortName: data.shortName ?? "",
        tagline: data.tagline ?? "",
        description: data.description ?? "",
        phone: data.phone ?? "",
        phoneRaw: data.phoneRaw ?? "",
        email: data.email ?? "",
        whatsapp: data.whatsapp ?? "",
        address: data.address ?? "",
        mapsEmbed: data.mapsEmbed ?? "",
        socials: {
          facebook: data.socials?.facebook ?? "",
          instagram: data.socials?.instagram ?? "",
          youtube: data.socials?.youtube ?? "",
          twitter: data.socials?.twitter ?? "",
          linkedin: data.socials?.linkedin ?? "",
        },
      });
    }
  }, [data, reset]);

  const onSubmit = (values: SiteSettingsInput) => {
    updateMutation.mutate(values);
  };

  if (isPending) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Site Settings"
          description="Manage your brand identity, contact details, and social links shown across your website."
        />

        <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">
            Loading site settings...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    const apiError = toApiError(error);

    return (
      <div className="space-y-5">
        <PageHeader
          title="Site Settings"
          description="Manage your brand identity, contact details, and social links shown across your website."
        />

        <Card>
          <CardContent className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {apiError.message || "Unable to load site settings."}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Settings"
        description="Manage your brand identity, contact details, and social links shown across your website."
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Brand */}
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="Enter site name"
                aria-invalid={!!errors.name}
              />
            </Field>

            <Field label="Short name" error={errors.shortName?.message}>
              <Input
                {...register("shortName")}
                placeholder="Enter short name"
                aria-invalid={!!errors.shortName}
              />
            </Field>

            <Field label="Tagline" wide error={errors.tagline?.message}>
              <Input
                {...register("tagline")}
                placeholder="Enter site tagline"
                aria-invalid={!!errors.tagline}
              />
            </Field>

            <Field label="Description" wide error={errors.description?.message}>
              <Textarea
                rows={4}
                {...register("description")}
                placeholder="Describe your institution"
                aria-invalid={!!errors.description}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Phone (display)" error={errors.phone?.message}>
              <Input
                {...register("phone")}
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.phone}
              />
            </Field>

            <Field label="Phone (tel: link)" error={errors.phoneRaw?.message}>
              <Input
                {...register("phoneRaw")}
                placeholder="+919876543210"
                aria-invalid={!!errors.phoneRaw}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <Input
                type="email"
                {...register("email")}
                placeholder="contact@example.com"
                aria-invalid={!!errors.email}
              />
            </Field>

            <Field label="WhatsApp number" error={errors.whatsapp?.message}>
              <Input
                {...register("whatsapp")}
                placeholder="Enter WhatsApp number"
                aria-invalid={!!errors.whatsapp}
              />
            </Field>

            <Field label="Address" wide error={errors.address?.message}>
              <Textarea
                rows={3}
                {...register("address")}
                placeholder="Enter institution address"
                aria-invalid={!!errors.address}
              />
            </Field>

            <Field label="Google Maps embed URL" wide error={errors.mapsEmbed?.message}>
              <Textarea
                rows={2}
                {...register("mapsEmbed")}
                placeholder="Enter Google Maps embed URL"
                aria-invalid={!!errors.mapsEmbed}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Social links */}
        <Card>
          <CardHeader>
            <CardTitle>Social links</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Facebook" error={errors.socials?.facebook?.message}>
              <Input
                type="url"
                {...register("socials.facebook")}
                placeholder="https://facebook.com/..."
                aria-invalid={!!errors.socials?.facebook}
              />
            </Field>

            <Field label="Instagram" error={errors.socials?.instagram?.message}>
              <Input
                type="url"
                {...register("socials.instagram")}
                placeholder="https://instagram.com/..."
                aria-invalid={!!errors.socials?.instagram}
              />
            </Field>

            <Field label="YouTube" error={errors.socials?.youtube?.message}>
              <Input
                type="url"
                {...register("socials.youtube")}
                placeholder="https://youtube.com/..."
                aria-invalid={!!errors.socials?.youtube}
              />
            </Field>

            <Field label="Twitter / X" error={errors.socials?.twitter?.message}>
              <Input
                type="url"
                {...register("socials.twitter")}
                placeholder="https://x.com/..."
                aria-invalid={!!errors.socials?.twitter}
              />
            </Field>

            <Field label="LinkedIn" error={errors.socials?.linkedin?.message}>
              <Input
                type="url"
                {...register("socials.linkedin")}
                placeholder="https://linkedin.com/..."
                aria-invalid={!!errors.socials?.linkedin}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending || isSubmitting}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  wide,
  error,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  wide?: boolean;
  error?: string;
}) {
  return (
    <div className={`min-w-0 space-y-2 ${wide ? "md:col-span-2" : ""}`}>
      <Label className={error ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {children}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}