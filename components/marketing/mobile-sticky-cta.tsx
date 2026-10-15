"use client";

import { SITE } from "@/constants/site";
import { useSiteSettingsQuery } from "@/queries/settings.queries";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { SiteSettings } from "@/types";

export function MobileStickyCTA({
  initialSettings,
}: {
  initialSettings?: SiteSettings | null;
} = {}) {
  const { data: settings } = useSiteSettingsQuery();
  const currentSettings = settings ?? initialSettings;
  const phoneRaw =
    currentSettings?.phoneRaw || currentSettings?.phone || SITE.phoneRaw;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-2">
        <a
          href={`tel:${phoneRaw}`}
          suppressHydrationWarning
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <Link
          href="/admission"
          className="bg-gradient-ocean flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white shadow-elegant"
        >
          Apply Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
