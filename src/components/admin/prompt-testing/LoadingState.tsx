
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoadingState() {
  return (
    <div className="flex justify-center items-center py-12">
      <LoadingSpinner size="lg" />
      <span className="ml-2">Loading prompt tests...</span>
    </div>
  );
}
