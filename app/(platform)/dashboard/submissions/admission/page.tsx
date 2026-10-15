"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Undo2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toApiError } from "@/lib/api-error";
import type { AdmissionSubmissionItem } from "@/types/admission";
import {
  useAdmissionSubmissionsQuery,
  useDeleteAdmissionSubmissionMutation,
  useUpdateAdmissionSubmissionMutation,
} from "@/queries/admission.queries";

export default function AdmissionSubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "handled"
  >("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSubmission, setSelectedSubmission] =
    useState<AdmissionSubmissionItem | null>(null);
  const [itemToDelete, setItemToDelete] =
    useState<AdmissionSubmissionItem | null>(null);

  const handledQueryParam =
    statusFilter === "all" ? undefined : statusFilter === "handled";

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useAdmissionSubmissionsQuery({
    page,
    limit,
    handled: handledQueryParam,
    search: searchTerm || undefined,
  });

  const updateMutation = useUpdateAdmissionSubmissionMutation({
    onSuccess: (updated) => {
      toast.success(
        updated.handled
          ? "Application marked as handled."
          : "Application marked as pending.",
      );
      if (selectedSubmission?.id === updated.id) {
        setSelectedSubmission(updated);
      }
    },
    onError: (err) => {
      toast.error(toApiError(err).message);
    },
  });

  const deleteMutation = useDeleteAdmissionSubmissionMutation({
    onSuccess: () => {
      toast.success("Admission application deleted.");
      setItemToDelete(null);
      if (selectedSubmission?.id === itemToDelete?.id) {
        setSelectedSubmission(null);
      }
    },
    onError: (err) => {
      toast.error(toApiError(err).message);
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  const handleFilterChange = (filter: "all" | "pending" | "handled") => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handleToggleHandled = (item: AdmissionSubmissionItem) => {
    updateMutation.mutate({
      id: item.id,
      data: { handled: !item.handled },
    });
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <PageHeader
        title="Admission Applications"
        description="Review candidate registrations, academic backgrounds, target exams, and track admissions counseling status."
      />

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border bg-muted/30 self-start">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("pending")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              statusFilter === "pending"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            Pending
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("handled")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              statusFilter === "handled"
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Handled
          </button>
        </div>

        {/* Search and Refresh */}
        <div className="flex items-center gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center flex-1 sm:w-72"
          >
            <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search candidate, ID, phone..."
              className="pl-8 pr-8 h-9 text-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 px-3 gap-1.5 text-xs shrink-0"
            title="Refresh applications list"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      {isPending ? (
        <Card>
          <CardContent className="space-y-4 py-8">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded bg-muted/60" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="space-y-3 py-10 text-center">
            <p className="text-sm font-medium text-destructive">
              {toApiError(error).message || "Failed to load admission applications."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                No admission applications found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "No applications matched your current filters. Try resetting search."
                  : "When prospective cadets apply via the admission form, their applications will appear here."}
              </p>
            </div>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  handleClearSearch();
                }}
                className="text-xs"
              >
                Reset filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {items.length} of {pagination?.total ?? items.length}{" "}
              {pagination?.total === 1 ? "application" : "applications"}
            </span>
            <span>Sorted by newest submission</span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[140px] font-medium">Application ID</TableHead>
                  <TableHead className="min-w-[190px] font-medium">Candidate</TableHead>
                  <TableHead className="min-w-[170px] font-medium">Contact Details</TableHead>
                  <TableHead className="min-w-[160px] hidden md:table-cell font-medium">Exam & Course</TableHead>
                  <TableHead className="min-w-[110px] hidden lg:table-cell font-medium">Applied Date</TableHead>
                  <TableHead className="w-24 font-medium">Status</TableHead>
                  <TableHead className="w-28 text-right pr-4 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`transition-colors hover:bg-muted/30 ${
                      !item.handled ? "bg-amber-500/[0.02]" : ""
                    }`}
                  >
                    {/* Application Reference ID */}
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md inline-block">
                        {item.applicationId}
                      </span>
                    </TableCell>

                    {/* Candidate Name & Location */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground text-sm flex items-center gap-1.5">
                          {item.fullName}
                        </p>
                        {item.city && (
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground/70" />
                            {item.city}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Contact (Phone & Email) */}
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <a
                          href={`tel:${item.phone}`}
                          className="font-mono text-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {item.phone}
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-muted-foreground hover:text-primary flex items-center gap-1.5 truncate max-w-[180px] transition-colors"
                          title={item.email}
                        >
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate">{item.email}</span>
                        </a>
                      </div>
                    </TableCell>

                    {/* Target Exam & Course */}
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        {item.targetExam ? (
                          <Badge
                            variant="secondary"
                            className="bg-accent/10 text-accent border border-accent/20 text-[11px] px-2 py-0.5 font-normal max-w-[180px] truncate block"
                            title={item.targetExam}
                          >
                            {item.targetExam}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        {item.course && (
                          <p
                            className="text-[11px] text-muted-foreground truncate max-w-[180px]"
                            title={item.course}
                          >
                            {item.course}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Applied Date */}
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* Handled Status Badge */}
                    <TableCell>
                      {item.handled ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 gap-1 font-normal"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Handled
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs px-2 py-0.5 gap-1 font-normal"
                        >
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick Toggle Handled Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleHandled(item)}
                          disabled={updateMutation.isPending}
                          className={`h-8 px-2 text-xs gap-1 ${
                            item.handled
                              ? "text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                              : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          }`}
                          title={
                            item.handled
                              ? "Mark application as pending"
                              : "Mark application as handled"
                          }
                        >
                          {item.handled ? (
                            <>
                              <Undo2 className="h-3.5 w-3.5" />
                              <span className="hidden xl:inline">Undo</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span className="hidden xl:inline">Handled</span>
                            </>
                          )}
                        </Button>

                        {/* View Details Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSubmission(item)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="View application details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setItemToDelete(item)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete application"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4 px-1">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Full Application Details Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3 pr-6">
                  <div>
                    <span className="font-mono text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md inline-block mb-1">
                      {selectedSubmission.applicationId}
                    </span>
                    <DialogTitle className="text-lg">
                      {selectedSubmission.fullName}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Registered on{" "}
                      {new Date(selectedSubmission.createdAt).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        },
                      )}
                    </DialogDescription>
                  </div>

                  {selectedSubmission.handled ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Handled
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs px-2.5 py-1 gap-1"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Pending
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Contact Information Card */}
                <div className="rounded-lg border bg-muted/20 p-4 space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Contact & Personal Information
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Phone Number
                      </span>
                      <a
                        href={`tel:${selectedSubmission.phone}`}
                        className="font-semibold text-foreground hover:text-primary font-mono text-xs flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {selectedSubmission.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="font-semibold text-foreground hover:text-primary text-xs flex items-center gap-1 mt-0.5 truncate"
                      >
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{selectedSubmission.email}</span>
                      </a>
                    </div>
                    {selectedSubmission.dob && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Date of Birth
                        </span>
                        <span className="font-semibold text-foreground text-xs flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {selectedSubmission.dob}
                        </span>
                      </div>
                    )}
                    {selectedSubmission.city && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          City / State
                        </span>
                        <span className="font-semibold text-foreground text-xs flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {selectedSubmission.city}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic & Target Preferences */}
                <div className="rounded-lg border bg-muted/20 p-4 space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Academic & Training Preferences
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Target Defence Exam
                      </span>
                      <span className="font-semibold text-foreground text-xs block mt-0.5">
                        {selectedSubmission.targetExam || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Current Qualification
                      </span>
                      <span className="font-semibold text-foreground text-xs block mt-0.5">
                        {selectedSubmission.qualification || "Not specified"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-[11px]">
                        Preferred Batch / Course
                      </span>
                      <span className="font-semibold text-foreground text-xs block mt-0.5">
                        {selectedSubmission.course || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Message / Remarks */}
                {selectedSubmission.message && (
                  <div className="rounded-lg border bg-muted/20 p-4 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                      Candidate Notes / Questions
                    </span>
                    <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.message}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-row items-center justify-between sm:justify-between border-t pt-3 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setItemToDelete(selectedSubmission)}
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={selectedSubmission.handled ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleHandled(selectedSubmission)}
                    disabled={updateMutation.isPending}
                    className="text-xs gap-1.5"
                  >
                    {selectedSubmission.handled ? (
                      <>
                        <Undo2 className="h-3.5 w-3.5" />
                        Mark as Pending
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark as Handled
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(null)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admission Application?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to delete application{" "}
              <strong className="text-foreground font-mono">
                {itemToDelete?.applicationId}
              </strong>{" "}
              from candidate{" "}
              <strong className="text-foreground">
                {itemToDelete?.fullName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
