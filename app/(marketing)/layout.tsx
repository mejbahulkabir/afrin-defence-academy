import { BackToTop } from "@/components/marketing/back-to-top";
import { MobileStickyCTA } from "@/components/marketing/mobile-sticky-cta";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { MarketingNavbar } from "@/components/common/marketing-navbar";
import { MarketingFooter } from "@/components/common/marketing-footer";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <MarketingFooter />
      <WhatsAppButton />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  )
}