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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
    to: string;
    label: string;
    Icon: LucideIcon;
    end?: boolean;
}

export const PLATFORM_NAV: NavItem[] = [
    {
        to: "/dashboard",
        label: "Dashboard",
        Icon: LayoutDashboard,
        end: true,
    },
    { to: "/dashboard/site-settings", label: "Site Settings", Icon: Settings },
    { to: "/dashboard/banners", label: "Banners", Icon: ImageIcon },
    {
        to: "/dashboard/gallery",
        label: "Gallery Images",
        Icon: GalleryHorizontal,
    },
    { to: "/dashboard/courses", label: "Courses", Icon: BookOpen },
    { to: "/dashboard/exams", label: "Defence Exams", Icon: ScrollText },
    { to: "/dashboard/faculty", label: "Faculty", Icon: Users },
    { to: "/dashboard/testimonials", label: "Testimonials", Icon: Quote },
    { to: "/dashboard/blog", label: "Blog", Icon: PenSquare },
    { to: "/dashboard/why-us", label: "Why Us", Icon: Sparkles },
    { to: "/dashboard/stats", label: "Stats", Icon: BarChart3 },
    {
        to: "/dashboard/submissions/contact",
        label: "Contact Inbox",
        Icon: Mail,
    },
    {
        to: "/dashboard/submissions/admission",
        label: "Applications",
        Icon: ClipboardList,
    },
];