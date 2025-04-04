
import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
  /**
   * Whether to show a semi-transparent overlay background
   * @default true
   */
  showBackground?: boolean;
  /**
   * The size of the loading spinner
   * @default "md"
   */
  spinnerSize?: "sm" | "md" | "lg";
  /**
   * ARIA live region announcement mode
   * @default "polite"
   */
  ariaLive?: "polite" | "assertive" | "off";
}

export function LoadingOverlay({ 
  message = "Loading...", 
  className,
  showBackground = true,
  spinnerSize = "md",
  ariaLive = "polite"
}: LoadingOverlayProps) {
  return (
    <div 
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center z-10",
        showBackground ? "bg-white/80 dark:bg-gray-900/80" : "",
        className
      )}
      role="status"
      aria-live={ariaLive}
    >
      <LoadingSpinner size={spinnerSize} className="text-primary" />
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
      <span className="sr-only">{message}</span>
    </div>
  );
}
