"use client";

import { SITE } from "@/constants/site";
import { useSiteSettingsQuery } from "@/queries/settings.queries";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const { data: settings } = useSiteSettingsQuery();

  const name = settings?.name || SITE.name;
  const rawWhatsapp = settings?.whatsapp || SITE.whatsapp || "";
  const cleanNumber = rawWhatsapp.replace(/[^0-9]/g, "");

  const href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hi ${name}, I'd like to know more about your defence programs.`,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      suppressHydrationWarning
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elegant transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="pointer-events-none absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
    </a>
  );
}