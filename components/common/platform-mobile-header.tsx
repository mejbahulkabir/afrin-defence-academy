"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";
import { ThemeToggle } from "./theme-toggle";
import { PLATFORM_NAV } from "./platform-navigation";
import { LogoutButton } from "../platform/logout-button";
import { useSiteSettingsQuery } from "@/queries/settings.queries";

export function PlatformMobileHeader() {
  const pathname = usePathname();
  const { data: settings } = useSiteSettingsQuery();
  const [open, setOpen] = useState(false);

  const siteName = settings?.name || SITE.name;

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-ocean shadow-elegant">
            <Shield className="h-5 w-5 text-white" />
          </span>

          <span className="min-w-0">
            <span
              className="block truncate text-sm font-semibold text-foreground"
              suppressHydrationWarning
            >
              {siteName}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Console
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="platform-mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <aside
            id="platform-mobile-navigation"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-border bg-background shadow-xl"
          >
            {/* Drawer header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-ocean shadow-elegant">
                  <Shield className="h-5 w-5 text-white" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {SITE.name}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Console
                  </span>
                </span>
              </Link>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav
              aria-label="Console navigation"
              className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
            >
              {PLATFORM_NAV.map(({ to, label, Icon, end }) => {
                const isActive = end
                  ? pathname === to
                  : pathname === to || pathname.startsWith(`${to}/`);

                return (
                  <Link
                    key={to}
                    href={to}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-[18px] w-[18px] shrink-0"
                    />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer actions */}
            <div className="shrink-0 space-y-2 border-t border-border p-3">
              <div className="flex items-center justify-between rounded-lg px-3 py-2">
                <span className="text-sm text-muted-foreground">
                  Appearance
                </span>
                <ThemeToggle />
              </div>

              <LogoutButton
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                iconClassName="h-[18px] w-[18px]"
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}