import { Suspense } from "react";
import { BackToTop } from "@/components/marketing/back-to-top";
import { MobileStickyCTA } from "@/components/marketing/mobile-sticky-cta";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { MarketingNavbar } from "@/components/common/marketing-navbar";
import { MarketingFooter } from "@/components/common/marketing-footer";
import { getCoursesServer, getSiteSettingsServer } from "@/lib/server-data";

export const instant = false;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, courses] = await Promise.all([
    getSiteSettingsServer(),
    getCoursesServer(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-20" />
        }
      >
        <MarketingNavbar initialSettings={settings} />
      </Suspense>
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <MarketingFooter
        initialSettings={settings}
        initialCourses={courses}
      />
      <WhatsAppButton initialSettings={settings} />
      <BackToTop />
      <MobileStickyCTA initialSettings={settings} />
    </div>
  );
}