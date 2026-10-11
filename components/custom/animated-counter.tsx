"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  label,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const durationMs = 1600;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (currentTime: number) => {
      const progress = Math.min(
        1,
        (currentTime - startTime) / durationMs,
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(value * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        <span>{count.toLocaleString()}</span>
        <span className="text-accent">{suffix}</span>
      </div>

      <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}