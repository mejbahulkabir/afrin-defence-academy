import type { Metadata } from "next";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Home,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/marketing/sections/page-header";
import { CTASection } from "@/components/marketing/cta-section";
import AdmissionForm from "@/components/marketing/sections/admission-form";
import { AdmissionHelpline } from "@/components/marketing/sections/admission-helpline";

export const metadata: Metadata = {
  title: "Apply for Admission | Afrin Defence Academy",
  description:
    "Submit your online admission application for NDA, CDS, AFCAT, and SSB Interview batches at Afrin Defence Academy. Officer-led classroom & residential coaching.",
};

const ADMISSION_BENEFITS = [
  {
    icon: Users,
    title: "Officer-Led Mentorship",
    description:
      "Direct instruction from retired Col., Wing Cdr., and Navy officers with real SSB board experience.",
  },
  {
    icon: Compass,
    title: "Standard GTO Obstacle Course",
    description:
      "Replica military obstacle ground on-campus for Group Obstacle Races (GOR) and Individual Obstacles.",
  },
  {
    icon: BookOpen,
    title: "Current Affairs & NCERT Foundation",
    description:
      "Systematic study material, daily current affairs digest, and sectional speed tests.",
  },
  {
    icon: Home,
    title: "Residential Campus & Hostel",
    description:
      "Hygienic boarding, cadet mess, library, and 24/7 security for outstation candidates.",
  },
];

export default function AdmissionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admissions 2025–2026"
        title="Begin Your Journey to the Uniform"
        description="Apply online for our premier defence training programs. Limited batch sizes ensure individual attention and comprehensive personality grooming."
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-5">
          {/* Left Column: Academy Highlights & Admissions Contact */}
          <div className="lg:col-span-2 space-y-6">
            {/* Why Apply Box */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-ocean text-white shadow-elegant">
                  <Shield className="h-4 w-4" />
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Why Train With Us?
                </h3>
              </div>

              <div className="space-y-4">
                {ADMISSION_BENEFITS.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">
                        {title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admission Helpline Contacts */}
            <AdmissionHelpline />
          </div>

          {/* Right Column: Admission Application Form */}
          <AdmissionForm />
        </div>
      </section>

      <CTASection />
    </>
  );
}
