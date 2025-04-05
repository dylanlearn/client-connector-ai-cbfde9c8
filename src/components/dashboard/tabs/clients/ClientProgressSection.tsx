
import { ContentCard } from "@/components/ui/content-card";
import { ClientTaskProgress } from "@/types/client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientProgressSectionProps {
  clientProgress: ClientTaskProgress[];
  isLoading: boolean;
  limit?: number;
}

const ClientProgressSection = ({ clientProgress, isLoading, limit = 5 }: ClientProgressSectionProps) => {
  const displayProgress = clientProgress.slice(0, limit);
  
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <ContentCard title="Client Progress">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      ) : displayProgress.length > 0 ? (
        <div className="space-y-4">
          {displayProgress.map((client) => (
            <div key={client.email} className="space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">{client.clientName}</p>
                <span className="text-sm text-muted-foreground">
                  {client.completed}/{client.total}
                </span>
              </div>
              <Progress value={client.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Last active: {formatDate(client.lastActive)}</span>
                <span>{client.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No client progress data available</p>
        </div>
      )}
    </ContentCard>
  );
};

export default ClientProgressSection;
