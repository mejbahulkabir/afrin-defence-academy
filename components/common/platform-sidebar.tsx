"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    BookOpen,
    ScrollText,
    Users,
    Quote,
    PenSquare,
    Sparkles,
    BarChart3,
    Image as ImageIcon,
    GalleryHorizontal,
    Mail,
    ClipboardList,
    LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
    to: string;
    label: string;
    Icon: LucideIcon;
    end?: boolean;
}

const NAV: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, end: true },
    { to: "/dashboard/site", label: "Site Settings", Icon: Settings },
    { to: "/dashboard/banners", label: "Banners", Icon: ImageIcon },
    { to: "/dashboard/gallery", label: "Gallery Images", Icon: GalleryHorizontal },
    { to: "/dashboard/courses", label: "Courses", Icon: BookOpen },
    { to: "/dashboard/exams", label: "Defence Exams", Icon: ScrollText },
    { to: "/dashboard/faculty", label: "Faculty", Icon: Users },
    { to: "/dashboard/testimonials", label: "Testimonials", Icon: Quote },
    { to: "/dashboard/blog", label: "Blog", Icon: PenSquare },
    { to: "/dashboard/why-us", label: "Why Us", Icon: Sparkles },
    { to: "/dashboard/stats", label: "Stats", Icon: BarChart3 },
    { to: "/dashboard/submissions/contact", label: "Contact Inbox", Icon: Mail },
    { to: "/dashboard/submissions/admission", label: "Applications", Icon: ClipboardList },
];

export function PlatformSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
            <div className="px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Afrin Defence
                </div>
                <div className="mt-0.5 text-base font-semibold text-slate-900">
                    Admin Panel
                </div>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
                {NAV.map(({ to, label, Icon, end }) => {
                    const isActive = end
                        ? pathname === to
                        : pathname === to || pathname.startsWith(`${to}/`);

                    return (
                        <Link
                            key={to}
                            href={to}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${isActive
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 p-2">
                <button
                    type="button"
                    onClick={() => router.replace("/login")}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}