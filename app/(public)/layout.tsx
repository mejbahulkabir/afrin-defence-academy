import { BackToTop } from "@/components/custom/back-to-top";
import { MobileStickyCTA } from "@/components/custom/mobile-sticky-cta";
import { WhatsAppButton } from "@/components/custom/whatsapp-button";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <PublicFooter />
      <WhatsAppButton />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  )
}