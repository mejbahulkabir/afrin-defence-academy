"use client";

import { FACULTY } from "@/constants/data";
import { FacultyCard } from "../custom/cards";
import { stagger } from "../animations/variants";
import { motion } from "framer-motion";

export default function AcademyFaculties() {
    return (
        <section className="py-20 md:py-24">
            <div className="container mx-auto px-4">
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {FACULTY.map((f) => (<FacultyCard key={f.id} faculty={f} />))}
                </motion.div>
            </div>
        </section>
    )
}
