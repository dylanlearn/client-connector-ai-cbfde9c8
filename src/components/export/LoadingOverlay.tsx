
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">Preparing your document...</p>
    </div>
  );
}
