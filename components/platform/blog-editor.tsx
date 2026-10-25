"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  ArrowLeft,
  Check,
  Clock,
  Eye,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  Save,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { toApiError } from "@/lib/api-error";
import type { BlogPostItem } from "@/types/blog";
import {
  blogPostSchema,
  type BlogPostInput,
} from "@/validations/blog.schema";
import {
  useBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
} from "@/queries/blog.queries";
import { PhotoUpload } from "./photo-upload";

export interface BlogEditorProps {
  id?: number;
  initialData?: BlogPostItem | null;
  isEditing?: boolean;
}

const CATEGORY_SUGGESTIONS = [
  "SSB Interview",
  "Written Exams",
  "Physical Standards",
  "Current Affairs",
  "Strategy & Tips",
  "Cadet Life",
  "Defence News",
];

export function BlogEditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-9 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 w-full animate-pulse rounded-xl bg-card border" />
          <div className="h-96 w-full animate-pulse rounded-xl bg-card border" />
        </div>
        <div className="space-y-4">
          <div className="h-44 w-full animate-pulse rounded-xl bg-card border" />
          <div className="h-64 w-full animate-pulse rounded-xl bg-card border" />
        </div>
      </div>
    </div>
  );
}

function BlogEditorForm({
  initialData,
  isEditing,
}: {
  initialData?: BlogPostItem | null;
  isEditing: boolean;
}) {
  const router = useRouter();

  const createMutation = useCreateBlogPostMutation({
    onSuccess: () => {
      toast.success("Article published successfully.");
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const updateMutation = useUpdateBlogPostMutation({
    onSuccess: () => {
      toast.success("Article updated successfully.");
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof blogPostSchema>, unknown, BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      slug: initialData?.slug ?? "",
      title: initialData?.title ?? "",
      image: initialData?.image ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      category: initialData?.category ?? "Strategy & Tips",
      author: initialData?.author ?? "Afrin Defence Academy",
      date: initialData?.date ?? todayFormatted,
      readingTime: initialData?.readingTime ?? "4 min read",
      published: initialData?.published ?? true,
    },
    mode: "onTouched",
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const currentImage = watch("image");
  const contentValue = watch("content");
  const isPublished = watch("published");

  // Auto-generate slug on blur if not editing
  const handleTitleBlur = () => {
    if (!isEditing && titleValue && !slugValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  // Calculate word count and estimated reading time
  const wordCount = useMemo(() => {
    if (!contentValue) return 0;
    return contentValue.trim().split(/\s+/).filter(Boolean).length;
  }, [contentValue]);

  const handleContentBlur = () => {
    if (contentValue) {
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      setValue("readingTime", `${minutes} min read`);
    }
  };

  useEffect(() => {
    if (initialData) {
      reset({
        slug: initialData.slug,
        title: initialData.title,
        image: initialData.image ?? "",
        excerpt: initialData.excerpt ?? "",
        content: initialData.content ?? "",
        category: initialData.category ?? "Strategy & Tips",
        author: initialData.author ?? "Afrin Defence Academy",
        date: initialData.date ?? todayFormatted,
        readingTime: initialData.readingTime ?? "4 min read",
        published: initialData.published,
      });
    }
  }, [initialData, reset, todayFormatted]);

  const onSubmit = (values: BlogPostInput) => {
    if (isEditing && initialData) {
      updateMutation.mutate({
        id: initialData.id,
        data: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 text-xs h-9"
          >
            <Link href="/dashboard/blog">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Articles
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {isEditing ? "Edit Article" : "Write New Article"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? `Updating "${initialData?.title}"`
                : "Craft a comprehensive guide, SSB strategy, or academy update"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {slugValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 text-xs text-muted-foreground hover:text-foreground hidden md:inline-flex"
            >
              <a
                href={`/blog/${slugValue}`}
                target="_blank"
                rel="noreferrer"
                title="View preview on website"
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </a>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/blog")}
            disabled={isPending}
            className="text-xs h-9"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="gap-1.5 text-xs h-9 font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {isEditing ? "Saving Changes..." : "Publishing..."}
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                {isEditing ? "Save Changes" : isPublished ? "Publish Post" : "Save as Draft"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Title, Slug, Excerpt, Body Editor (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className={`text-sm font-semibold ${
                    errors.title ? "text-destructive" : ""
                  }`}
                >
                  Article Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  onBlur={handleTitleBlur}
                  placeholder="e.g. Complete Roadmap to Crack NDA Written Exam on First Attempt"
                  className="text-base sm:text-lg font-medium h-12"
                  aria-invalid={!!errors.title}
                  disabled={isPending}
                />
                {errors.title && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="slug"
                    className={`text-xs font-medium ${
                      errors.slug ? "text-destructive" : ""
                    }`}
                  >
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    https://afrindefenceacademy.in/blog/{slugValue || "your-slug"}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-xs font-mono text-muted-foreground select-none">
                    /blog/
                  </div>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="complete-roadmap-to-crack-nda"
                    className="pl-14 font-mono text-xs h-9"
                    aria-invalid={!!errors.slug}
                    disabled={isPending}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* Short Excerpt */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="excerpt"
                  className={`text-xs font-medium ${
                    errors.excerpt ? "text-destructive" : ""
                  }`}
                >
                  Short Summary / Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  {...register("excerpt")}
                  placeholder="A concise 1-2 sentence overview shown on blog list cards and search result snippets..."
                  aria-invalid={!!errors.excerpt}
                  disabled={isPending}
                />
                <p className="text-[11px] text-muted-foreground">
                  Catchy teaser shown on the homepage and article listing cards.
                </p>
                {errors.excerpt && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>

              {/* Full Article Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="content"
                    className={`text-sm font-semibold ${
                      errors.content ? "text-destructive" : ""
                    }`}
                  >
                    Article Content
                  </Label>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                  </div>
                </div>

                <Textarea
                  id="content"
                  rows={18}
                  {...register("content")}
                  onBlur={handleContentBlur}
                  placeholder={`Write your full article here...\n\nYou can organize your post with headings, paragraphs, bullet points, and tips.\n\nExample:\n## Phase 1: Understanding the Exam Pattern\n- Mathematics: 300 marks\n- General Ability Test (GAT): 600 marks\n\n## Phase 2: Recommended Books & Resources\nStay dedicated and maintain physical endurance alongside daily problem-solving.`}
                  className="font-sans leading-relaxed text-sm min-h-[380px] p-4 resize-y"
                  aria-invalid={!!errors.content}
                  disabled={isPending}
                />
                {errors.content && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Publish Status, Featured Image & Metadata (1 col on lg) */}
        <div className="space-y-6">
          {/* Publish Settings Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Publish Status</span>
                {isPublished ? (
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 cursor-pointer select-none transition-colors hover:bg-muted/40">
                <input
                  type="checkbox"
                  {...register("published")}
                  disabled={isPending}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-foreground block">
                    Live on Website
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    When checked, candidates and visitors can discover and read this article on your blog.
                  </span>
                </div>
              </label>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full gap-1.5 h-10 font-medium"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {isEditing ? "Update Article" : "Save and Publish"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Featured / Cover Image Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span>Cover Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                label=""
                value={currentImage}
                onChange={(url) => setValue("image", url, { shouldValidate: true })}
                folder="blog"
                variant="landscape"
                disabled={isPending}
                error={errors.image?.message}
                hint="PNG, JPG, WEBP up to 5MB (16:9 recommended)"
                placeholder="https://... or /storage/blog/cover.jpg"
              />
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Metadata & Categorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-medium">
                  Category / Topic
                </Label>
                <Input
                  id="category"
                  {...register("category")}
                  list="category-suggestions"
                  placeholder="e.g. SSB Interview"
                  aria-invalid={!!errors.category}
                  disabled={isPending}
                  className="h-9 text-xs"
                />
                <datalist id="category-suggestions">
                  {CATEGORY_SUGGESTIONS.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <div className="flex flex-wrap gap-1 pt-1">
                  {CATEGORY_SUGGESTIONS.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setValue("category", cat, { shouldValidate: true })}
                      className="text-[10px] bg-muted/60 hover:bg-muted px-2 py-0.5 rounded transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <Label htmlFor="author" className="text-xs font-medium">
                  Author Name
                </Label>
                <Input
                  id="author"
                  {...register("author")}
                  placeholder="Afrin Defence Academy"
                  aria-invalid={!!errors.author}
                  disabled={isPending}
                  className="h-9 text-xs"
                />
              </div>

              {/* Publication Date */}
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-medium">
                  Display Date
                </Label>
                <Input
                  id="date"
                  {...register("date")}
                  placeholder="Oct 15, 2026"
                  aria-invalid={!!errors.date}
                  disabled={isPending}
                  className="h-9 text-xs"
                />
              </div>

              {/* Reading Time */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="readingTime" className="text-xs font-medium">
                    Reading Time
                  </Label>
                  <button
                    type="button"
                    onClick={handleContentBlur}
                    className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    <Clock className="h-3 w-3" />
                    Auto-calc
                  </button>
                </div>
                <Input
                  id="readingTime"
                  {...register("readingTime")}
                  placeholder="5 min read"
                  aria-invalid={!!errors.readingTime}
                  disabled={isPending}
                  className="h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export function BlogEditor({
  id,
  initialData,
  isEditing = false,
}: BlogEditorProps) {
  // If editing by id and initialData is not provided, fetch it
  const shouldFetch = isEditing && id !== undefined && !initialData;
  const { data, isPending, isError, error, refetch } = useBlogPostQuery(
    shouldFetch ? (id as number) : 0,
  );

  if (shouldFetch) {
    if (isPending) {
      return <BlogEditorSkeleton />;
    }

    if (isError || !data) {
      return (
        <div className="space-y-6">
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/dashboard/blog">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Articles
            </Link>
          </Button>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="space-y-3 py-10 text-center">
              <p className="text-sm font-medium text-destructive">
                {toApiError(error).message ||
                  "Blog article not found or failed to load."}
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
        </div>
      );
    }

    return <BlogEditorForm initialData={data} isEditing={true} />;
  }

  return (
    <BlogEditorForm
      initialData={initialData}
      isEditing={isEditing || Boolean(initialData)}
    />
  );
}
