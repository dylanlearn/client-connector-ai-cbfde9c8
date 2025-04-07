
import { ClientError } from "@/utils/monitoring/types";
import { ErrorCard } from "./ErrorCard";
import { Loader2 } from "lucide-react";
import { AlertMessage } from "@/components/ui/alert-message";

interface ErrorListProps {
  errors: ClientError[];
  isLoading: boolean;
  onResolveClick: (error: ClientError) => void;
}

export function ErrorList({ errors, isLoading, onResolveClick }: ErrorListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (errors.length === 0) {
    return (
      <AlertMessage type="info" title="No errors found">
        No client errors have been recorded matching the current filter.
      </AlertMessage>
    );
  }
  
  return (
    <div className="space-y-4">
      {errors.map((error) => (
        <ErrorCard 
          key={error.id}
          error={error}
          onResolveClick={onResolveClick}
        />
      ))}
    </div>
  );
}
