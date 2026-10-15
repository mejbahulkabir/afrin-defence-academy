"use client";

import { Mail, MapPin, Phone, Shield } from "lucide-react";
import { NAV_LINKS, SITE } from "@/constants/site";
import Link from "next/link";
import { CurrentYear } from "../marketing/current-year";
import { useSiteSettingsQuery } from "@/queries/settings.queries";
import { useCoursesQuery } from "@/queries/courses.queries";

export function MarketingFooter() {
  const { data: settings, isMounted } = useSiteSettingsQuery();
  const { data: courses } = useCoursesQuery();

  const name = settings?.name || SITE.name;
  const tagline = settings?.tagline || SITE.tagline;
  const phone = settings?.phone || SITE.phone;
  const phoneRaw = settings?.phoneRaw || settings?.phone || SITE.phoneRaw;
  const email = settings?.email || SITE.email;
  const address = settings?.address || SITE.address;
  const socials = settings?.socials || SITE.socials;

  const socialLinks = [
    { href: socials?.facebook, label: "Facebook" },
    { href: socials?.instagram, label: "Instagram" },
    { href: socials?.youtube, label: "YouTube" },
    { href: socials?.twitter, label: "Twitter" },
    { href: socials?.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href && s.href !== "#");

  const programList =
    isMounted && courses && courses.length > 0
      ? courses.slice(0, 5).map((c) => ({ label: c.title, to: "/courses" }))
      : [
          { label: "NDA Foundation", to: "/courses" },
          { label: "CDS Intensive", to: "/courses" },
          { label: "AFCAT Pro", to: "/courses" },
          { label: "SSB Interview", to: "/courses" },
          { label: "CAPF AC", to: "/courses" },
        ];

  return (
    <footer className="bg-gradient-ocean relative mt-20 overflow-hidden text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div
                className="font-display text-lg font-semibold tracking-tight"
                suppressHydrationWarning
              >
                {name}
              </div>
            </div>
            <p
              className="mt-4 max-w-xs text-sm text-white/70"
              suppressHydrationWarning
            >
              {tagline}. Training the next generation of officers since 2007.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-xs text-white transition-colors hover:bg-white/15"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-soft)]">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-soft)]">
              Programs
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {programList.map((p, idx) => (
                <li key={idx}>
                  <Link
                    href={p.to}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-soft)]">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2" suppressHydrationWarning>
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />{" "}
                <a
                  href={`tel:${phoneRaw}`}
                  className="hover:text-white"
                  suppressHydrationWarning
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />{" "}
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white"
                  suppressHydrationWarning
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center">
          <p suppressHydrationWarning>
            © <CurrentYear /> {name}. All rights reserved.
          </p>
          <p>Crafted with discipline · Built for India&apos;s future officers</p>
        </div>
      </div>
    </footer>
  );
}