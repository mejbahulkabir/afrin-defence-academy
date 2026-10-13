import { PlatformSidebar } from "@/components/common/platform-sidebar";

export default function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <PlatformSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden bg-slate-50 px-4 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}