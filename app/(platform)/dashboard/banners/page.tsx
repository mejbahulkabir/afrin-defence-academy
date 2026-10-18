"use client";

import { useState } from "react";
import {
  ExternalLink,
  ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/platform/page-header";
import { BannerDialog } from "@/components/platform/banner-dialog";
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
import type { BannerItem, BannerSlot } from "@/types/banner";
import {
  useBannersQuery,
  useDeleteBannerMutation,
} from "@/queries/banners.queries";

export default function BannersPage() {
  const [selectedSlot, setSelectedSlot] = useState<BannerSlot | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<BannerItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BannerItem | null>(null);

  const querySlot = selectedSlot === "all" ? undefined : selectedSlot;
  const {
    data: items,
    isPending,
    isError,
    error,
    refetch,
  } = useBannersQuery(querySlot);

  const deleteMutation = useDeleteBannerMutation({
    onSuccess: () => {
      toast.success("Banner deleted successfully.");
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

  const handleEdit = (item: BannerItem) => {
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
        title="Promotional & Hero Banners"
        description="Manage hero slider slides, call-to-action cards, announcement banners, and campaign messaging."
        actions={
          <Button onClick={handleCreate} className="inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Create Banner
          </Button>
        }
      />

      {/* Filter Tabs by Slot */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <Button
          type="button"
          size="sm"
          variant={selectedSlot === "all" ? "default" : "outline"}
          onClick={() => setSelectedSlot("all")}
          className="h-8 text-xs"
        >
          All Banners
        </Button>
        <Button
          type="button"
          size="sm"
          variant={selectedSlot === "hero" ? "default" : "outline"}
          onClick={() => setSelectedSlot("hero")}
          className="h-8 text-xs"
        >
          Hero Slides
        </Button>
        <Button
          type="button"
          size="sm"
          variant={selectedSlot === "cta" ? "default" : "outline"}
          onClick={() => setSelectedSlot("cta")}
          className="h-8 text-xs"
        >
          Call-to-Action (CTA)
        </Button>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-4">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-muted/50" />
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
              {toApiError(error).message || "Failed to load banners."}
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
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No banners found
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {selectedSlot === "all"
                ? "Create hero slides or call-to-action banners to highlight admissions and courses."
                : `No banners found in the "${selectedSlot}" slot. Create one to display it on the website.`}
            </p>
            <Button onClick={handleCreate} size="sm" className="mt-5 gap-1.5">
              <Plus className="h-4 w-4" />
              Create your first banner
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table Data View */}
      {!isPending && !isError && items && items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {items.length} {items.length === 1 ? "banner" : "banners"}
            </span>
            <span>Sorted by display order</span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-16 text-center font-medium">Order</TableHead>
                  <TableHead className="w-24 font-medium">Preview</TableHead>
                  <TableHead className="w-28 font-medium">Slot</TableHead>
                  <TableHead className="min-w-[220px] font-medium">Headline & Content</TableHead>
                  <TableHead className="min-w-[170px] hidden lg:table-cell font-medium">Action Links</TableHead>
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
                      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border bg-muted/40 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title || "Banner preview"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      {item.slot === "hero" ? (
                        <Badge
                          variant="secondary"
                          className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 text-xs px-2 py-0.5 uppercase tracking-wide font-semibold"
                        >
                          Hero
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 text-xs px-2 py-0.5 uppercase tracking-wide font-semibold"
                        >
                          CTA
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {item.eyebrow && (
                          <span className="text-[10px] font-semibold tracking-wider uppercase text-primary block">
                            {item.eyebrow}
                          </span>
                        )}
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.title || <span className="text-muted-foreground italic font-normal">Untitled Banner</span>}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[280px]">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        {item.ctaLabel && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-medium text-foreground">{item.ctaLabel}</span>
                            {item.ctaHref && (
                              <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1 py-0.2 rounded truncate max-w-[120px]">
                                {item.ctaHref}
                              </span>
                            )}
                          </div>
                        )}
                        {item.secondaryLabel && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>{item.secondaryLabel}</span>
                            {item.secondaryHref && (
                              <span className="font-mono text-[10px] bg-muted/40 px-1 py-0.2 rounded truncate max-w-[120px]">
                                {item.secondaryHref}
                              </span>
                            )}
                          </div>
                        )}
                        {!item.ctaLabel && !item.secondaryLabel && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
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
                          title="Edit banner"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setItemToDelete(item)}
                          title="Delete banner"
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
      <BannerDialog
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
            <AlertDialogTitle>Delete this banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this banner? It will be permanently removed from your website and storage.
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
