"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { SiteSettings } from "@/types/site-settings";
import {
  settingsKeys,
  siteSettingsQueryOptions,
  updateSiteSettingsMutationOptions,
} from "@/queries/settings.queries";

const EMPTY: SiteSettings = {
  name: "",
  socials: {},
};

export default function SiteSettingsPage() {
  const queryClient = useQueryClient();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery(siteSettingsQueryOptions());

  const [values, setValues] = useState<SiteSettings>(EMPTY);

  useEffect(() => {
    if (data) {
      setValues({
        ...EMPTY,
        ...data,
        socials: {
          ...EMPTY.socials,
          ...data.socials,
        },
      });
    }
  }, [data]);

  const set =
    (key: keyof SiteSettings) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setValues((current) => ({
        ...current,
        [key]: value,
      }));
    };

  const setSocial =
    (key: keyof NonNullable<SiteSettings["socials"]>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setValues((current) => ({
        ...current,
        socials: {
          ...current.socials,
          [key]: value,
        },
      }));
    };

  const updateMutation = useMutation({
    ...updateSiteSettingsMutationOptions(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.site(),
      });

      toast.success("Site settings saved successfully.");
    },

    onError: (error: unknown) => {
      toast.error(toApiError(error).message);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Brand */}
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Name" required>
              <Input
                value={values.name}
                onChange={set("name")}
                required
                placeholder="Enter site name"
              />
            </Field>

            <Field label="Short name">
              <Input
                value={values.shortName ?? ""}
                onChange={set("shortName")}
                placeholder="Enter short name"
              />
            </Field>

            <Field label="Tagline" wide>
              <Input
                value={values.tagline ?? ""}
                onChange={set("tagline")}
                placeholder="Enter site tagline"
              />
            </Field>

            <Field label="Description" wide>
              <Textarea
                rows={4}
                value={values.description ?? ""}
                onChange={set("description")}
                placeholder="Describe your institution"
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
            <Field label="Phone (display)">
              <Input
                value={values.phone ?? ""}
                onChange={set("phone")}
                placeholder="+91 98765 43210"
              />
            </Field>

            <Field label="Phone (tel: link)">
              <Input
                value={values.phoneRaw ?? ""}
                onChange={set("phoneRaw")}
                placeholder="+919876543210"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={values.email ?? ""}
                onChange={set("email")}
                placeholder="contact@example.com"
              />
            </Field>

            <Field label="WhatsApp number">
              <Input
                value={values.whatsapp ?? ""}
                onChange={set("whatsapp")}
                placeholder="Enter WhatsApp number"
              />
            </Field>

            <Field label="Address" wide>
              <Textarea
                rows={3}
                value={values.address ?? ""}
                onChange={set("address")}
                placeholder="Enter institution address"
              />
            </Field>

            <Field label="Google Maps embed URL" wide>
              <Textarea
                rows={2}
                value={values.mapsEmbed ?? ""}
                onChange={set("mapsEmbed")}
                placeholder="Enter Google Maps embed URL"
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
            <Field label="Facebook">
              <Input
                type="url"
                value={values.socials?.facebook ?? ""}
                onChange={setSocial("facebook")}
                placeholder="https://facebook.com/..."
              />
            </Field>

            <Field label="Instagram">
              <Input
                type="url"
                value={values.socials?.instagram ?? ""}
                onChange={setSocial("instagram")}
                placeholder="https://instagram.com/..."
              />
            </Field>

            <Field label="YouTube">
              <Input
                type="url"
                value={values.socials?.youtube ?? ""}
                onChange={setSocial("youtube")}
                placeholder="https://youtube.com/..."
              />
            </Field>

            <Field label="Twitter / X">
              <Input
                type="url"
                value={values.socials?.twitter ?? ""}
                onChange={setSocial("twitter")}
                placeholder="https://x.com/..."
              />
            </Field>

            <Field label="LinkedIn">
              <Input
                type="url"
                value={values.socials?.linkedin ?? ""}
                onChange={setSocial("linkedin")}
                placeholder="https://linkedin.com/..."
              />
            </Field>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending}>
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
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={`min-w-0 space-y-2 ${wide ? "md:col-span-2" : ""}`}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {children}
    </div>
  );
}