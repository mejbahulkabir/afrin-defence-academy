"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/constants/site";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

import { useSiteSettingsQuery } from "@/queries/settings.queries";
import type { SiteSettings } from "@/types";

export function MarketingNavbar({
  initialSettings,
}: {
  initialSettings?: SiteSettings | null;
} = {}) {
  const pathname = usePathname();
  const { data: settings } = useSiteSettingsQuery();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const currentSettings = settings ?? initialSettings;
  const siteName = currentSettings?.name || SITE.name;
  const tagline = currentSettings?.shortName
    ? `${currentSettings.shortName} Defence Academy`
    : "Defence Forces Academy";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="lg" priority />
          <div className="leading-tight">
            <div
              className="font-display text-base font-semibold tracking-tight text-foreground"
              suppressHydrationWarning
            >
              {siteName}
            </div>
            <div
              className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block"
              suppressHydrationWarning
            >
              {tagline}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const isActive =
              l.to === "/"
                ? pathname === "/"
                : pathname === l.to || pathname?.startsWith(`${l.to}/`);

            return (
              <Link
                key={l.to}
                href={l.to}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-accent/15 font-semibold text-accent"
                    : "text-foreground/80 hover:bg-secondary/70 hover:text-accent",
                )}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="active-marketing-nav"
                    className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button
            asChild
            className={cn(
              "bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)]",
              pathname === "/admission" && "ring-2 ring-accent ring-offset-2",
            )}
          >
            <Link href="/admission">Apply Now</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((l) => {
                const isActive =
                  l.to === "/"
                    ? pathname === "/"
                    : pathname === l.to || pathname?.startsWith(`${l.to}/`);

                return (
                  <Link
                    key={l.to}
                    href={l.to}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent/15 font-semibold text-accent"
                        : "text-foreground/90 hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <span>{l.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                    )}
                  </Link>
                );
              })}
              <Button
                asChild
                className="mt-2 bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)]"
              >
                <Link href="/admission" onClick={() => setOpen(false)}>
                  Apply Now
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
