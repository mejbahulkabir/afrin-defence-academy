"use client";

import { useState } from "react";
import {
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/platform/page-header";
import { GalleryDialog } from "@/components/platform/gallery-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import type { GalleryImageItem } from "@/types/gallery";
import {
  useDeleteGalleryMutation,
  useGalleryQuery,
} from "@/queries/gallery.queries";

export default function GalleryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<GalleryImageItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryImageItem | null>(null);

  const {
    data: items,
    isPending,
    isError,
    error,
    refetch,
  } = useGalleryQuery();

  const deleteMutation = useDeleteGalleryMutation({
    onSuccess: () => {
      toast.success("Gallery photo deleted successfully.");
      setItemToDelete(null);
    },
    onError: (err) => {
      toast.error(toApiError(err).message);
    },
  });

  const handleCreate = () => {
    setItemToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: GalleryImageItem) => {
    setItemToEdit(item);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <PageHeader
        title="Photo Gallery"
        description="Manage campus photographs, cadet drill sessions, classroom moments, and outdoor training images."
        actions={
          <Button onClick={handleCreate} className="inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Upload Image
          </Button>
        }
      />

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
              {toApiError(error).message || "Failed to load gallery images."}
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
      {!isPending && !isError && (!items || items.length === 0) && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No gallery images yet
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Upload photos to showcase cadet life, physical training, and academy events.
            </p>
            <Button onClick={handleCreate} size="sm" className="mt-5 gap-1.5">
              <Plus className="h-4 w-4" />
              Upload your first photo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table Data View */}
      {!isPending && !isError && items && items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {items.length} {items.length === 1 ? "image" : "images"}
            </span>
            <span>Sorted by display order</span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-16 text-center font-medium">Order</TableHead>
                  <TableHead className="w-20 font-medium">Image</TableHead>
                  <TableHead className="min-w-[200px] font-medium">Caption & URL</TableHead>
                  <TableHead className="min-w-[150px] hidden sm:table-cell font-medium">Alt Text</TableHead>
                  <TableHead className="w-24 font-medium">Status</TableHead>
                  <TableHead className="w-28 hidden md:table-cell font-medium">Updated</TableHead>
                  <TableHead className="w-24 text-right pr-4 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-center font-mono">
                      <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                        #{item.order}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-muted/40 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt={item.alt || item.caption || "Gallery item"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.caption || <span className="text-muted-foreground italic font-normal">No caption</span>}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded truncate max-w-[240px]"
                            title={item.src}
                          >
                            {item.src}
                          </span>
                          <a
                            href={item.src}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="Open image"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      <span className="line-clamp-2" title={item.alt ?? ""}>
                        {item.alt || "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {item.active ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground px-2 py-0.5"
                        >
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap hidden md:table-cell">
                      {new Date(item.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleEdit(item)}
                          title="Edit image"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setItemToDelete(item)}
                          title="Delete image"
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

      {/* Create / Edit Modal Dialog */}
      <GalleryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemToEdit={itemToEdit}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this gallery image?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photograph? It will be removed from your website and storage immediately.
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
