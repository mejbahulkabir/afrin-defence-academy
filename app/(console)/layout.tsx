import { ConsoleSidebar } from "@/components/layout/console-sidebar";


export default function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <ConsoleSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden bg-slate-50 px-4 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}