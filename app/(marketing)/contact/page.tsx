"use client";

import { useMemo } from "react";
import ContactForm from "@/components/marketing/sections/contact-form";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { SITE } from "@/constants/site";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { useSiteSettingsQuery } from "@/queries/settings.queries";

function getMapSrc(embedOrUrl?: string | null): string {
  if (!embedOrUrl) return SITE.mapsEmbed;
  if (embedOrUrl.includes("<iframe")) {
    const match = embedOrUrl.match(/src=["'](.*?)["']/);
    if (match && match[1]) return match[1];
  }
  if (embedOrUrl.startsWith("http")) {
    return embedOrUrl;
  }
  return SITE.mapsEmbed;
}

export default function ContactPage() {
  const { data: settings, isPending } = useSiteSettingsQuery();

  const phone = settings?.phone || SITE.phone;
  const phoneRaw = settings?.phoneRaw || settings?.phone || SITE.phoneRaw;
  const email = settings?.email || SITE.email;
  const address = settings?.address || SITE.address;
  const whatsapp = settings?.whatsapp || SITE.whatsapp;
  const mapsSrc = getMapSrc(settings?.mapsEmbed);

  const contactItems = useMemo(() => {
    const items = [
      {
        Icon: Phone,
        title: "Call us",
        value: phone,
        href: `tel:${phoneRaw}`,
      },
      {
        Icon: Mail,
        title: "Email",
        value: email,
        href: `mailto:${email}`,
      },
    ];

    if (whatsapp) {
      items.push({
        Icon: MessageSquare,
        title: "WhatsApp",
        value: whatsapp,
        href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
      });
    }

    items.push({
      Icon: MapPin,
      title: "Visit",
      value: address,
      href: undefined as any,
    });

    return items;
  }, [phone, phoneRaw, email, address, whatsapp]);

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Talk to our admissions team"
        description="We're here Monday to Saturday, 9 AM to 7 PM IST."
      />
      <section className="py-20 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {contactItems.map(({ Icon, title, value, href }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/40 hover:shadow-elegant"
              >
                <div className="bg-gradient-ocean flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-elegant">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {title}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={title === "WhatsApp" ? "_blank" : undefined}
                      rel={
                        title === "WhatsApp" ? "noopener noreferrer" : undefined
                      }
                      suppressHydrationWarning
                      className="mt-1 block truncate text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {value}
                    </a>
                  ) : (
                    <p
                      className="mt-1 text-sm font-medium text-foreground"
                      suppressHydrationWarning
                    >
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Afrin Defence Academy location"
                src={mapsSrc}
                loading="lazy"
                suppressHydrationWarning
                className="h-72 w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
