"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/platform/page-header";
import { FacultyDialog } from "@/components/platform/faculty-dialog";
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
import { generateInitials } from "@/lib/utils";
import type { FacultyItem } from "@/types/faculty";
import {
  useDeleteFacultyMutation,
  useFacultyQuery,
} from "@/queries/faculty.queries";

export default function FacultyPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<FacultyItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FacultyItem | null>(null);

  const {
    data: items,
    isPending,
    isError,
    error,
    refetch,
  } = useFacultyQuery();

  const deleteMutation = useDeleteFacultyMutation({
    onSuccess: () => {
      toast.success("Faculty member deleted successfully.");
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

  const handleEdit = (item: FacultyItem) => {
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
        title="Faculty & Mentors"
        description="Manage the instructors, retired defence officers, and subject matter experts shown across your website."
        actions={
          <Button onClick={handleCreate} className="inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Create New
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
                <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-muted/50" />
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
              {toApiError(error).message || "Failed to load faculty members."}
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
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No faculty members yet
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Add mentors, ex-defence officers, and academic experts who guide your cadets.
            </p>
            <Button onClick={handleCreate} size="sm" className="mt-5 gap-1.5">
              <Plus className="h-4 w-4" />
              Add your first faculty member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table Data View */}
      {!isPending && !isError && items && items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {items.length} {items.length === 1 ? "mentor" : "mentors"}
            </span>
            <span>Sorted by display order</span>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-16 text-center font-medium">Order</TableHead>
                  <TableHead className="min-w-[200px] font-medium">Faculty Member</TableHead>
                  <TableHead className="min-w-[170px] font-medium">Role</TableHead>
                  <TableHead className="min-w-[230px] font-medium">Specialization & Experience</TableHead>
                  <TableHead className="w-32 hidden md:table-cell font-medium">Updated</TableHead>
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
                      <div className="flex items-center gap-2.5">
                        {item.image ? (
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                              unoptimized={
                                item.image.startsWith("/storage") ||
                                item.image.startsWith("http")
                              }
                            />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {generateInitials(item.name)}
                          </div>
                        )}
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-medium text-foreground leading-tight">
                            {item.name}
                          </p>
                          {item.rank && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                              {item.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-foreground text-sm font-medium">
                      {item.role}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {item.specialization && (
                          <p className="text-xs text-foreground/90 font-medium">
                            {item.specialization}
                          </p>
                        )}
                        {item.experience && (
                          <span className="text-[11px] text-muted-foreground">
                            {item.experience} experience
                          </span>
                        )}
                        {!item.specialization && !item.experience && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
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
                          title="Edit member"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setItemToDelete(item)}
                          title="Delete member"
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
      <FacultyDialog
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
            <AlertDialogTitle>Delete this faculty member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &ldquo;{itemToDelete?.name}&rdquo; from your faculty roster? This will immediately remove them from your website.
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
