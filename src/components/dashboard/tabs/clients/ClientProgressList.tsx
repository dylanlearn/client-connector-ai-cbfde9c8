
import { ClientTaskProgress } from "@/types/client";
import ClientProgressItem from "./ClientProgressItem";

interface ClientProgressListProps {
  clientProgress: ClientTaskProgress[];
  limit?: number;
  onClientClick?: (clientId: string) => void;
}

/**
 * List component for displaying client progress items
 */
export default function ClientProgressList({ 
  clientProgress,
  limit,
  onClientClick
}: ClientProgressListProps) {
  const displayProgress = limit ? clientProgress.slice(0, limit) : clientProgress;
  
  return (
    <div className="space-y-4">
      {displayProgress.map((progress, index) => (
        <ClientProgressItem 
          key={index} 
          clientName={progress.clientName || "Unnamed Client"}
          email={progress.email}
          completed={progress.completed}
          total={progress.total}
          lastActive={progress.lastActive} // Now accepts string
          onClick={progress.linkId && onClientClick ? () => onClientClick(progress.linkId!) : undefined}
        />
      ))}
    </div>
  );
}
