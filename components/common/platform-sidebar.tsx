"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";
import { ThemeToggle } from "./theme-toggle";
import { PLATFORM_NAV } from "./platform-navigation";
import { LogoutButton } from "../platform/logout-button";
import { useSiteSettingsQuery } from "@/queries/settings.queries";

export function PlatformSidebar() {
  const pathname = usePathname();
  const { data: settings } = useSiteSettingsQuery();

  const siteName = settings?.name || SITE.name;

  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      {/* Brand */}
      <div className="border-b border-border px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-gradient-ocean flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-elegant">
            <Shield className="h-5 w-5 text-white" />
          </div>

          <div className="min-w-0 leading-tight">
            <p
              className="truncate text-sm font-semibold tracking-tight text-foreground"
              suppressHydrationWarning
            >
              {siteName}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Management Console
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>

        {PLATFORM_NAV.map(({ to, label, Icon, end }) => {
          const isActive = end
            ? pathname === to
            : pathname === to || pathname.startsWith(`${to}/`);

          return (
            <Link
              key={to}
              href={to}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                "transition-colors duration-200",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-1 rounded-full bg-[var(--navy-deep)]"
                />
              )}

              <Icon
                aria-hidden="true"
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-accent-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />

              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="space-y-2 border-t border-border p-3">
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <span className="text-sm font-medium text-foreground">
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
  );
}