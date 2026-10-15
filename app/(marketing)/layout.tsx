import { Suspense } from "react";
import { BackToTop } from "@/components/marketing/back-to-top";
import { MobileStickyCTA } from "@/components/marketing/mobile-sticky-cta";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { MarketingNavbar } from "@/components/common/marketing-navbar";
import { MarketingFooter } from "@/components/common/marketing-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<header className="fixed inset-x-0 top-0 z-50 h-16 md:h-20" />}>
        <MarketingNavbar />
      </Suspense>
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <MarketingFooter />
      <WhatsAppButton />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  )
}