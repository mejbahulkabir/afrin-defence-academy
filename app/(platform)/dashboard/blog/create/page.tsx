import { Suspense } from "react";
import {
  BlogEditor,
  BlogEditorSkeleton,
} from "@/components/platform/blog-editor";

export const instant = false;

export default function CreateBlogPage() {
  return (
    <Suspense fallback={<BlogEditorSkeleton />}>
      <BlogEditor isEditing={false} />
    </Suspense>
  );
}
