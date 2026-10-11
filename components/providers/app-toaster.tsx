
"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/providers/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      richColors
      theme={theme}
      toastOptions={{
        classNames: {
          closeButton:
            "!left-auto !right-0 !transform !translate-x-1/3 !-translate-y-1/3",
        },
      }}
    />
  );
}
