"use client";

import { SITE } from "@/constants/site";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-2">
        <a href={`tel:${SITE.phoneRaw}`} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground">
          <Phone className="h-4 w-4" /> Call
        </a>
        <Link href="/admission" className="bg-gradient-ocean flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white shadow-elegant">
          Apply Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
