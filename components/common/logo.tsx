import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizePresets: Record<LogoSize, { dim: number; containerClass: string }> = {
  xs: { dim: 24, containerClass: "h-6 w-6" },
  sm: { dim: 36, containerClass: "h-9 w-9" },
  md: { dim: 40, containerClass: "h-10 w-10" },
  lg: { dim: 48, containerClass: "h-12 w-12" },
  xl: { dim: 64, containerClass: "h-16 w-16" },
};

export interface LogoProps {
  size?: LogoSize | number;
  className?: string;
  imageClassName?: string;
  alt?: string;
  priority?: boolean;
}

export function Logo({
  size = "md",
  className,
  imageClassName,
  alt = "Afrin Defence Academy",
  priority = false,
}: LogoProps) {
  const isPreset = typeof size === "string" && size in sizePresets;
  const dimension = isPreset
    ? sizePresets[size as LogoSize].dim
    : typeof size === "number"
      ? size
      : 40;
  const containerSizeClass = isPreset
    ? sizePresets[size as LogoSize].containerClass
    : undefined;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        containerSizeClass,
        className,
      )}
      style={!isPreset ? { width: dimension, height: dimension } : undefined}
    >
      <Image
        src="/assets/logo.jpeg"
        alt={alt}
        width={dimension}
        height={dimension}
        priority={priority}
        className={cn("h-full w-full object-cover rounded-full", imageClassName)}
      />
    </div>
  );
}
