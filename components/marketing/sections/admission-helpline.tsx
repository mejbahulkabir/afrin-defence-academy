"use client";

import { SITE } from "@/constants/site";
import { useSiteSettingsQuery } from "@/queries/settings.queries";
import { Phone, Mail, Clock } from "lucide-react";

export function AdmissionHelpline() {
  const { data: settings } = useSiteSettingsQuery();

  const phone = settings?.phone || SITE.phone;
  const phoneRaw = settings?.phoneRaw || settings?.phone || SITE.phoneRaw;
  const email = settings?.email || SITE.email;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
        Admissions Desk
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Helpline & WhatsApp
            </span>
            <a
              href={`tel:${phoneRaw}`}
              className="font-medium text-foreground hover:text-accent font-mono"
              suppressHydrationWarning
            >
              {phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Email Inquiries
            </span>
            <a
              href={`mailto:${email}`}
              className="font-medium text-foreground hover:text-accent"
              suppressHydrationWarning
            >
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Counseling Hours
            </span>
            <span className="font-medium text-foreground">
              Mon – Sat: 08:30 AM – 07:00 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
