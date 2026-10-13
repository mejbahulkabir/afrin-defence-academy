import { PlatformSidebar } from "@/components/common/platform-sidebar";
import { PlatformMobileHeader } from "@/components/common/platform-mobile-header";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <PlatformMobileHeader />

      <div className="flex min-h-0 flex-1">
        <PlatformSidebar />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-background px-4 py-6 transition-colors duration-200 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}