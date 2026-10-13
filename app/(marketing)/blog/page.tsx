import AllBlogs from "@/components/marketing/sections/all-blogs";
import { PageHeader } from "@/components/marketing/sections/page-header";


export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Insights" title="Strategy & service writing" description="Long-form articles from our faculty — practical, specific and based on what actually works." />
      <AllBlogs />
    </>
  )
}
