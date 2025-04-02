
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

interface ClientProgressEmptyProps {
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty state component for client progress section
 */
export default function ClientProgressEmpty({ action }: ClientProgressEmptyProps) {
  return (
    <EmptyState
      icon={<Users className="h-6 w-6 text-muted-foreground" />}
      title="No client progress"
      description="You don't have any active clients with progress to track yet."
      action={action}
    />
  );
}
