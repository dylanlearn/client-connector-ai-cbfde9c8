
import { ClientTaskProgress } from "@/types/client";
import { ClientProgressItem } from "./ClientProgressItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard } from "@/components/ui/content-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

interface ClientProgressSectionProps {
  clientProgress: ClientTaskProgress[] | null;
  isLoading: boolean;
  limit?: number;
}

export default function ClientProgressSection({
  clientProgress,
  isLoading,
  limit = 3
}: ClientProgressSectionProps) {
  const displayProgress = clientProgress?.slice(0, limit) || [];
  
  if (isLoading) {
    return (
      <ContentCard title="Client Progress">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </ContentCard>
    );
  }
  
  if (!clientProgress || clientProgress.length === 0) {
    return (
      <ContentCard title="Client Progress">
        <EmptyState
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
          title="No client progress"
          description="You don't have any active clients with progress to track yet."
          action={{
            label: "Add Client",
            onClick: () => window.location.href = "/clients"
          }}
        />
      </ContentCard>
    );
  }
  
  return (
    <ContentCard 
      title="Client Progress" 
      footer={
        <div className="w-full flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link to="/clients">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {displayProgress.map((progress, index) => (
          <ClientProgressItem key={index} progress={progress} />
        ))}
      </div>
    </ContentCard>
  );
}
