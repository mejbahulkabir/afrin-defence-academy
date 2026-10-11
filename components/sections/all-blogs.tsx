"use client"

import { BLOG_POSTS } from "@/constants/data"
import { motion } from "motion/react"
import { BlogCard } from "../custom/cards"
import { stagger } from "../animations/variants"

export default function AllBlogs() {
  return (
    <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((p) => (<BlogCard key={p.slug} post={p} />))}
          </motion.div>
        </div>
      </section>
  )
}
