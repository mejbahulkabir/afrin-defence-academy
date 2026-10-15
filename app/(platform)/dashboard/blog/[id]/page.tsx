import { Suspense } from "react";
import { BlogEditor, BlogEditorSkeleton } from "@/components/platform/blog-editor";

export const instant = false;

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  return (
    <Suspense fallback={<BlogEditorSkeleton />}>
      <BlogEditor id={numId} isEditing={true} />
    </Suspense>
  );
}
