"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Filter,
  GraduationCap,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { CourseCard } from "../cards";
import { stagger, fadeUp } from "@/components/animations/variants";
import { useCoursesQuery } from "@/queries/courses.queries";
import type { Course } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ModeFilter = "All" | "Hybrid" | "Offline" | "Online";
type LevelFilter = "All" | "Foundation" | "Intermediate" | "Advanced";

export default function CoursesSection() {
  const { data: courses, isLoading } = useCoursesQuery();

  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState<ModeFilter>("All");
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("All");

  // Transform courses strictly from API/database
  const allCourses: Course[] = useMemo(() => {
    if (courses) {
      return courses
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          duration: c.duration || "6 Months",
          mode: c.mode,
          level: c.level,
          description: c.description || "",
          features: c.features || [],
          popular: c.popular,
          order: c.order,
        }));
    }

    return [];
  }, [courses]);

  // Filter based on search query, mode, and level
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        search.trim() === "" ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        Boolean(course.description?.toLowerCase().includes(search.toLowerCase())) ||
        course.features.some((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        );

      const matchesMode =
        selectedMode === "All" || course.mode === selectedMode;

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesMode && matchesLevel;
    });
  }, [allCourses, search, selectedMode, selectedLevel]);

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedMode !== "All" ||
    selectedLevel !== "All";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedMode("All");
    setSelectedLevel("All");
  };

  const modeOptions: ModeFilter[] = ["All", "Hybrid", "Offline", "Online"];
  const levelOptions: LevelFilter[] = [
    "All",
    "Foundation",
    "Intermediate",
    "Advanced",
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Controls Bar: Search + Mode / Level Filters */}
        <div className="mb-12 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search programs, exams (NDA, CDS, AFCAT), or features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mode Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mode:
              </span>
              {modeOptions.map((mode) => {
                const isSelected = selectedMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[var(--navy-deep)] text-white shadow-sm"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Level Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Level:
              </span>
              {levelOptions.map((level) => {
                const isSelected = selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Status Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-accent" />
              <span>
                Showing <strong>{filteredCourses.length}</strong> of{" "}
                <strong>{allCourses.length}</strong> defence programs
              </span>
              {isLoading && (
                <span className="inline-flex items-center text-[10px] text-muted-foreground/70">
                  (refreshing...)
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 gap-1 px-2 text-xs font-medium text-accent hover:text-accent"
              >
                <RotateCcw className="h-3 w-3" /> Reset all filters
              </Button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            key={`${selectedMode}-${selectedLevel}-${search}`}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCourses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              No matching programs found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We couldn&apos;t find any course matching your current search or
              filters. Try clearing your filters to explore all tracks.
            </p>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="mt-6 gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

