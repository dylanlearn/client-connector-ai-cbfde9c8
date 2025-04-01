
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ClientLinksLoadingState() {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full max-w-[250px]" />
              <Skeleton className="h-4 w-full max-w-[200px]" />
              {!isMobile && <Skeleton className="h-4 w-full max-w-[150px]" />}
            </div>
            <div className="mt-2 sm:mt-0 ml-auto flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              {!isMobile && <Skeleton className="h-8 w-8 rounded-md" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
