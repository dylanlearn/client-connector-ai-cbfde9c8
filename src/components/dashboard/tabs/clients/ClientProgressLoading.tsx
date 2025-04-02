
import { Skeleton } from "@/components/ui/skeleton";

interface ClientProgressLoadingProps {
  count?: number;
}

/**
 * Loading state component for client progress section
 */
export default function ClientProgressLoading({ count = 3 }: ClientProgressLoadingProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </div>
  );
}
