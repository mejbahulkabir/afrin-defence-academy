"use client"

import { COURSES } from '@/constants/data'
import { CourseCard } from '../custom/cards'
import { stagger } from '../animations/variants'
import { motion } from 'framer-motion'

export default function CoursesSection() {
    return (
        <section className="py-20 md:py-24">
            <div className="container mx-auto px-4">
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {COURSES.map((c) => (<CourseCard key={c.slug} course={c} />))}
                </motion.div>
            </div>
        </section>
    )
}
