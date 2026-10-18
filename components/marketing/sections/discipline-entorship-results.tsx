"use client"

import { Award, Compass, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../section-heading';
import { fadeUp, stagger } from '@/components/animations/variants';

export default function DisciplineMentorshipResults() {
    const VALUES = [
        { Icon: Award, title: "Excellence", body: "Officer-grade standards in every class, mock and conference." },
        { Icon: Target, title: "Discipline", body: "A military-style schedule and code of conduct on campus." },
        { Icon: Users, title: "Mentorship", body: "1:30 mentor-to-cadet ratio with weekly 1-on-1 reviews." },
        { Icon: Compass, title: "Integrity", body: "Honest feedback, transparent fees, no false promises." },
    ];

    return (
        <section className="py-20 md:py-24">
            <div className="container mx-auto px-4">
                <SectionHeading eyebrow="Our values" title="Four pillars that shape every cadet" />
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map(({ Icon, title, body }) => (
                        <motion.div key={title} variants={fadeUp} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
                            <div className="bg-gradient-ocean inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"><Icon className="h-5 w-5" /></div>
                            <h3 className="font-display mt-4 text-lg font-semibold">{title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
