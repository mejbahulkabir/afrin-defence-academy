"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Image as ImageIcon,
  Layers,
  Mail,
  MapPin,
  PenSquare,
  Phone,
  Quote,
  RefreshCw,
  ScrollText,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/platform/page-header";
import { toApiError } from "@/lib/api-error";
import { useDashboardOverviewQuery } from "@/queries/dashboard.queries";

export default function Dashboard() {
  const { data, isPending, isError, error, refetch, isFetching } =
    useDashboardOverviewQuery();

  const counts = data?.counts;
  const recentContacts = data?.recentContacts ?? [];
  const recentAdmissions = data?.recentAdmissions ?? [];

  const tiles = [
    {
      label: "Courses",
      value: counts?.courses,
      to: "/dashboard/courses",
      Icon: BookOpen,
      badge: null,
    },
    {
      label: "Defence Exams",
      value: counts?.exams,
      to: "/dashboard/exams",
      Icon: ScrollText,
      badge: null,
    },
    {
      label: "Faculty",
      value: counts?.faculty,
      to: "/dashboard/faculty",
      Icon: Users,
      badge: null,
    },
    {
      label: "Testimonials",
      value: counts?.testimonials,
      to: "/dashboard/testimonials",
      Icon: Quote,
      badge: null,
    },
    {
      label: "Blog Posts",
      value: counts?.blogPosts,
      to: "/dashboard/blog",
      Icon: PenSquare,
      badge: null,
    },
    {
      label: "Gallery Images",
      value: counts?.galleryImages,
      to: "/dashboard/gallery",
      Icon: ImageIcon,
      badge: null,
    },
    {
      label: "Banners",
      value: counts?.banners,
      to: "/dashboard/banners",
      Icon: Layers,
      badge: null,
    },
    {
      label: "Contact Inbox",
      value: counts?.contactSubmissions,
      to: "/dashboard/submissions/contact",
      Icon: Mail,
      badge:
        counts?.contactPending && counts.contactPending > 0
          ? `${counts.contactPending} pending`
          : null,
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      label: "Applications",
      value: counts?.admissionSubmissions,
      to: "/dashboard/submissions/admission",
      Icon: ClipboardList,
      badge:
        counts?.admissionPending && counts.admissionPending > 0
          ? `${counts.admissionPending} new`
          : null,
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading with live refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Dashboard"
          description="Live overview and recent inquiries across afrindefenceacademy.in."
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-center gap-1.5 text-xs h-9"
          title="Refresh statistics"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </Button>
      </div>

      {isError && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="space-y-3 py-6 text-center">
            <p className="text-sm font-medium text-destructive">
              {toApiError(error).message ||
                "Failed to fetch live dashboard metrics."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Overview stats tiles */}
      <section
        aria-label="Content overview"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
      >
        {tiles.map(({ label, value, to, Icon, badge, badgeColor }) => (
          <Link
            key={label}
            href={to}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {label}
                    </span>
                    {badge && (
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 border font-normal ${badgeColor}`}
                      >
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  {isPending ? (
                    <div className="h-9 w-16 animate-pulse rounded bg-muted" />
                  ) : (
                    <p className="text-3xl font-semibold tracking-tight text-foreground">
                      {value ?? 0}
                    </p>
                  )}
                  <ArrowUpRight className="mb-1 h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Recent activity sections */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Recent Contact Messages */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>Recent Contact Messages</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest visitor messages from the website.
              </p>
            </div>

            <Link
              href="/dashboard/submissions/contact"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="flex-1 p-4">
            {isPending ? (
              <div className="space-y-3 py-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-full animate-pulse rounded-lg bg-muted/60"
                  />
                ))}
              </div>
            ) : recentContacts.length === 0 ? (
              <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                <Mail className="mb-2 h-6 w-6 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground">
                  No messages to display
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  New contact enquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentContacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href="/dashboard/submissions/contact"
                    className="block rounded-lg border border-border/80 bg-card p-3 transition-colors hover:bg-muted/40 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {contact.name}
                          </p>
                          {contact.handled ? (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                              Handled
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0"
                            >
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              Pending
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                          <span className="truncate max-w-[200px]">
                            {contact.email}
                          </span>
                        </div>

                        {contact.message && (
                          <p className="text-xs text-foreground/80 line-clamp-1 pt-0.5">
                            {contact.message}
                          </p>
                        )}
                      </div>

                      <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <span>Recent Applications</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest admission applications from candidates.
              </p>
            </div>

            <Link
              href="/dashboard/submissions/admission"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="flex-1 p-4">
            {isPending ? (
              <div className="space-y-3 py-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-full animate-pulse rounded-lg bg-muted/60"
                  />
                ))}
              </div>
            ) : recentAdmissions.length === 0 ? (
              <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                <ClipboardList className="mb-2 h-6 w-6 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground">
                  No applications to display
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  New admission applications will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentAdmissions.map((admission) => (
                  <Link
                    key={admission.id}
                    href="/dashboard/submissions/admission"
                    className="block rounded-lg border border-border/80 bg-card p-3 transition-colors hover:bg-muted/40 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                            {admission.applicationId}
                          </span>
                          <p className="font-semibold text-sm text-foreground truncate">
                            {admission.fullName}
                          </p>
                          {admission.handled ? (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                              Handled
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0"
                            >
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              New
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          {admission.targetExam && (
                            <span className="font-medium text-foreground/90">
                              {admission.targetExam}
                            </span>
                          )}
                          {admission.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {admission.city}
                            </span>
                          )}
                          <span className="font-mono">{admission.phone}</span>
                        </div>
                      </div>

                      <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                        {new Date(admission.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}