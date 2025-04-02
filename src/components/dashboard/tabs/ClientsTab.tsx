
import { useClientOverview } from "@/hooks/use-client-overview";
import { useClientProgress } from "@/hooks/use-client-progress";
import ClientActivityFeed from "@/components/clients/ClientActivityFeed";
import ClientStatsOverview from "./clients/ClientStatsOverview";
import ClientProgressSection from "./clients/ClientProgressSection";
import { ContentCard } from "@/components/ui/content-card";

export default function ClientsTab() {
  const {
    clientOverview,
    isLoadingOverview
  } = useClientOverview();

  const {
    clientProgress,
    isLoading: isLoadingProgress
  } = useClientProgress();
  
  return (
    <div className="space-y-6">
      {/* Client stats overview */}
      <ClientStatsOverview 
        clientOverview={clientOverview} 
        isLoading={isLoadingOverview} 
      />
      
      {/* Client activity and progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentCard title="Recent Activity">
          <ClientActivityFeed />
        </ContentCard>
        
        <ClientProgressSection
          clientProgress={clientProgress}
          isLoading={isLoadingProgress}
          limit={5}
        />
      </div>
    </div>
  );
}
