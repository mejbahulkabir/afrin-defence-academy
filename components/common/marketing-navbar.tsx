"use client"

import { useEffect, useState } from "react";
import { Menu, Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/constants/site";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <div className="bg-gradient-ocean flex h-9 w-9 items-center justify-center rounded-lg shadow-elegant">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-tight text-foreground">{SITE.name}</div>
            <div className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">Defence Forces Academy</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l: any) => (
            <Link
              key={l.to}
              href={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild className="bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)]">
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
              {NAV_LINKS.map((l:any) => (
                <Link
                  key={l.to}
                  href={l.to}
                  className="rounded-md px-3 py-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Button asChild className="mt-2 bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)]">
                <Link href="/admission">Apply Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}