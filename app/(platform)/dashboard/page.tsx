import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  Image as ImageIcon,
  Mail,
  PenSquare,
  Quote,
  ScrollText,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/platform/page-header";

const tiles = [
  { label: "Courses", value: 10, to: "/dashboard/courses", Icon: BookOpen },
  { label: "Defence Exams", value: 3, to: "/dashboard/exams", Icon: ScrollText },
  { label: "Faculty", value: 5, to: "/dashboard/faculty", Icon: Users },
  { label: "Testimonials", value: 44, to: "/dashboard/testimonials", Icon: Quote },
  { label: "Blog Posts", value: 22, to: "/dashboard/blog", Icon: PenSquare },
  { label: "Gallery Images", value: 0, to: "/dashboard/gallery", Icon: ImageIcon },
  {
    label: "Contact Inbox",
    value: 2,
    to: "/dashboard/submissions/contact",
    Icon: Mail,
  },
  {
    label: "Applications",
    value: 12,
    to: "/dashboard/submissions/admission",
    Icon: ClipboardList,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <PageHeader
        title="Dashboard"
        description="Manage all dynamic content for afrindefenceacademy.in."
      />

      {/* Overview stats */}
      <section
        aria-label="Content overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {tiles.map(({ label, value, to, Icon }) => (
          <Link
            key={label}
            href={to}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {label}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-semibold tracking-tight text-foreground">
                    {value ?? "—"}
                  </p>
                  <ArrowUpRight className="mb-1 h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Recent activity */}
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-base">Recent contact messages</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest enquiries from your website.
              </p>
            </div>

            <Link
              href="/dashboard/submissions/contact"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent>
            <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
              <Mail className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No messages to display
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New contact enquiries will appear here.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-base">Recent applications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest admission applications.
              </p>
            </div>

            <Link
              href="/dashboard/submissions/admission"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent>
            <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
              <ClipboardList className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No applications to display
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New admission applications will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}