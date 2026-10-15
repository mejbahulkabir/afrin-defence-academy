"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ImageIcon,
  Pencil,
  PenSquare,
  Plus,
  RefreshCw,
  Search,
  Trash2,
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
import type { BlogPostItem } from "@/types/blog";
import {
  useBlogPostsQuery,
  useDeleteBlogPostMutation,
} from "@/queries/blog.queries";

export default function BlogPage() {
  const [itemToDelete, setItemToDelete] = useState<BlogPostItem | null>(null);

  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: items,
    isPending,
    isError,
    error,
    refetch,
  } = useBlogPostsQuery();

  const deleteMutation = useDeleteBlogPostMutation({
    onSuccess: () => {
      toast.success("Blog article deleted successfully.");
      setItemToDelete(null);
    },
    onError: (err) => {
      toast.error(toApiError(err).message);
    },
  });

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter((post) => {
      // Status filter
      if (statusFilter === "published" && !post.published) return false;
      if (statusFilter === "draft" && post.published) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesSlug = post.slug.toLowerCase().includes(query);
        const matchesCategory = (post.category ?? "").toLowerCase().includes(query);
        const matchesAuthor = (post.author ?? "").toLowerCase().includes(query);

        if (!matchesTitle && !matchesSlug && !matchesCategory && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [items, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <PageHeader
        title="Blog & Articles"
        description="Write and publish educational guides, SSB interview tips, defence notifications, and cadet insights."
        actions={
          <Button asChild className="inline-flex items-center gap-1.5">
            <Link href="/dashboard/blog/create">
              <Plus className="h-4 w-4" />
              Write Post
            </Link>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border bg-muted/30 self-start">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Posts ({items?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "published"
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Published ({items?.filter((i) => i.published).length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "draft"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Drafts ({items?.filter((i) => !i.published).length ?? 0})
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by title, topic, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-9 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
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
        </div>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-4">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
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
              {toApiError(error).message || "Failed to load blog posts."}
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
      {!isPending && !isError && filteredItems.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PenSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No articles match your filter"
                : "No blog articles written yet"}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try clearing your search or switching the status filter tab."
                : "Share preparation tips, SSB psychological guidelines, and exam breakdowns with your cadets."}
            </p>
            {searchQuery || statusFilter !== "all" ? (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                size="sm"
                variant="outline"
                className="mt-4 text-xs"
              >
                Reset filters
              </Button>
            ) : (
              <Button asChild size="sm" className="mt-5 gap-1.5">
                <Link href="/dashboard/blog/create">
                  <Plus className="h-4 w-4" />
                  Write your first article
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table Data View */}
      {!isPending && !isError && filteredItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {filteredItems.length} of {items?.length ?? 0} {items?.length === 1 ? "article" : "articles"}
            </span>
            <span>Sorted by newest published</span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[240px] font-medium">Article & URL</TableHead>
                  <TableHead className="min-w-[140px] font-medium">Category</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell font-medium">Author</TableHead>
                  <TableHead className="min-w-[140px] hidden lg:table-cell font-medium">Date & Read Time</TableHead>
                  <TableHead className="w-24 font-medium">Status</TableHead>
                  <TableHead className="w-24 text-right pr-4 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    {/* Article Title & Slug */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/40 text-muted-foreground">
                            <ImageIcon className="h-4 w-4 opacity-50" />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <p className="font-medium text-foreground text-sm line-clamp-1">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded truncate max-w-[200px]">
                              /blog/{item.slug}
                            </span>
                            <a
                              href={`/blog/${item.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Preview article"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 font-normal"
                      >
                        {item.category || "General"}
                      </Badge>
                    </TableCell>

                    {/* Author */}
                    <TableCell className="text-sm text-foreground/90 hidden md:table-cell">
                      {item.author || "—"}
                    </TableCell>

                    {/* Date & Reading Time */}
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <p>{item.date || "—"}</p>
                        {item.readingTime && (
                          <span className="text-[11px] text-muted-foreground/80">
                            {item.readingTime}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {item.published ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground px-2 py-0.5"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit post"
                        >
                          <Link href={`/dashboard/blog/${item.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setItemToDelete(item)}
                          title="Delete post"
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
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &ldquo;{itemToDelete?.title}&rdquo;? This will remove the article from your website.
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
