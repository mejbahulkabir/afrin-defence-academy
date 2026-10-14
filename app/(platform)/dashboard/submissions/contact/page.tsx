"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Search,
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
import type { ContactSubmissionItem } from "@/types/contact";
import {
  useContactSubmissionsQuery,
  useDeleteContactSubmissionMutation,
  useUpdateContactSubmissionMutation,
} from "@/queries/contact.queries";

export default function ContactSubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "handled">("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmissionItem | null>(null);
  const [itemToDelete, setItemToDelete] =
    useState<ContactSubmissionItem | null>(null);

  const handledQueryParam =
    statusFilter === "all" ? undefined : statusFilter === "handled";

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useContactSubmissionsQuery({
    page,
    limit,
    handled: handledQueryParam,
    search: searchTerm || undefined,
  });

  const updateMutation = useUpdateContactSubmissionMutation({
    onSuccess: (updated) => {
      toast.success(
        updated.handled
          ? "Inquiry marked as handled."
          : "Inquiry marked as pending.",
      );
      if (selectedSubmission?.id === updated.id) {
        setSelectedSubmission(updated);
      }
    },
    onError: (err) => {
      toast.error(toApiError(err).message);
    },
  });

  const deleteMutation = useDeleteContactSubmissionMutation({
    onSuccess: () => {
      toast.success("Contact inquiry deleted.");
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

  const handleToggleHandled = (item: ContactSubmissionItem) => {
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
        title="Contact Inbox"
        description="Review inquiries, messages, and admission queries submitted by visitors from your website contact page."
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

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sender, email, subject..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 pr-8 h-9 text-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-3 text-xs">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-9 w-9 shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-4">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-muted/50" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="space-y-3 py-8 text-center">
            <p className="text-sm font-medium text-destructive">
              {toApiError(error).message || "Failed to load contact submissions."}
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
      )}

      {/* Empty State */}
      {!isPending && !isError && items.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No contact submissions found
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {searchTerm
                ? `No submissions matched "${searchTerm}". Try clearing your search.`
                : statusFilter !== "all"
                ? `There are no ${statusFilter} messages in your inbox.`
                : "When prospective candidates submit the website contact form, their queries will appear here."}
            </p>
            {searchTerm && (
              <Button onClick={handleClearSearch} size="sm" variant="outline" className="mt-4 text-xs">
                Clear search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table Data View */}
      {!isPending && !isError && items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {items.length} of {pagination?.total ?? items.length} inquiries
            </span>
            <span>Sorted by newest received</span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-28 font-medium">Status</TableHead>
                  <TableHead className="min-w-[190px] font-medium">Sender</TableHead>
                  <TableHead className="min-w-[200px] font-medium">Subject & Message</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell font-medium">Contact Details</TableHead>
                  <TableHead className="w-32 hidden lg:table-cell font-medium">Received</TableHead>
                  <TableHead className="w-28 text-right pr-4 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      !item.handled ? "bg-amber-500/[0.02]" : ""
                    }`}
                  >
                    {/* Status Badge */}
                    <TableCell>
                      {item.handled ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] px-2 py-0.5 inline-flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Handled
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[11px] px-2 py-0.5 inline-flex items-center gap-1 font-semibold"
                        >
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>

                    {/* Sender Name */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground block md:hidden">
                          {item.email}
                        </p>
                      </div>
                    </TableCell>

                    {/* Subject & Message Snippet */}
                    <TableCell>
                      <div className="space-y-0.5 max-w-[280px]">
                        <p className="font-medium text-sm text-foreground truncate">
                          {item.subject || (
                            <span className="italic text-muted-foreground font-normal">
                              General Inquiry
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.message}
                        </p>
                      </div>
                    </TableCell>

                    {/* Contact Details */}
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 text-xs">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[170px]">{item.email}</span>
                        </a>
                        <a
                          href={`tel:${item.phone}`}
                          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{item.phone}</span>
                        </a>
                      </div>
                    </TableCell>

                    {/* Received Date */}
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap hidden lg:table-cell">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Handled Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleHandled(item)}
                          disabled={updateMutation.isPending}
                          className={`h-8 w-8 ${
                            item.handled
                              ? "text-muted-foreground hover:text-amber-600"
                              : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          }`}
                          title={item.handled ? "Mark as pending" : "Mark as handled"}
                        >
                          {item.handled ? (
                            <Undo2 className="h-3.5 w-3.5" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          <span className="sr-only">
                            {item.handled ? "Mark pending" : "Mark handled"}
                          </span>
                        </Button>

                        {/* View Full Message */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedSubmission(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="View message details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">View</span>
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setItemToDelete(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
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
            <div className="flex items-center justify-between pt-2 px-1">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isPending}
                  className="h-8 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isPending}
                  className="h-8 text-xs gap-1"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Message Details Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2 pr-6">
              <DialogTitle className="text-lg">Inquiry Details</DialogTitle>
              {selectedSubmission?.handled ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5"
                >
                  Handled
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs px-2 py-0.5 font-semibold"
                >
                  Pending
                </Badge>
              )}
            </div>
            <DialogDescription>
              Received on{" "}
              {selectedSubmission &&
                new Date(selectedSubmission.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4 py-2 text-sm">
              {/* Sender Info Card */}
              <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <User className="h-4 w-4 text-primary" />
                  <span>{selectedSubmission.name}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{selectedSubmission.email}</span>
                  </a>
                  <a
                    href={`tel:${selectedSubmission.phone}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{selectedSubmission.phone}</span>
                  </a>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Subject
                </span>
                <p className="font-medium text-foreground">
                  {selectedSubmission.subject || "General Inquiry"}
                </p>
              </div>

              {/* Message Content */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Message
                </span>
                <div className="rounded-xl border bg-card p-4 whitespace-pre-wrap leading-relaxed text-foreground">
                  {selectedSubmission.message}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3 sm:space-x-0 w-full">
            {selectedSubmission && (
              <Button
                type="button"
                variant={selectedSubmission.handled ? "outline" : "default"}
                onClick={() => handleToggleHandled(selectedSubmission)}
                disabled={updateMutation.isPending}
                className="flex-1 sm:flex-initial"
              >
                {selectedSubmission.handled ? (
                  <>
                    <Undo2 className="h-3.5 w-3.5 mr-1.5" />
                    Mark as Pending
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Mark as Handled
                  </>
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedSubmission(null)}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the inquiry from &ldquo;{itemToDelete?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
