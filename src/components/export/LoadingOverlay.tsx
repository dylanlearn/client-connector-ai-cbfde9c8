
import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LoadingOverlayProps {
  message?: string;  // Make message optional
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-md z-10">
      <LoadingSpinner className="h-10 w-10 text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
