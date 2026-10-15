"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { stagger } from "@/components/animations/variants";
import { useFacultyQuery } from "@/queries/faculty.queries";
import { FacultyCard } from "../cards";
import type { Faculty } from "@/types";

export default function AcademyFaculties() {
  const { data: facultyData } = useFacultyQuery();

  const list: Faculty[] = useMemo(() => {
    if (facultyData && facultyData.length > 0) {
      return facultyData
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((f) => ({
          id: String(f.id),
          name: f.name,
          role: f.role,
          rank: f.rank?.trim() ? f.rank : undefined,
          experience: f.experience || "10+ yrs",
          specialization: f.specialization || "Defence Specialist",
          initials: f.initials || "",
        }));
    }

    return [];
  }, [facultyData]);

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((f) => (
            <FacultyCard key={f.id} faculty={f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
