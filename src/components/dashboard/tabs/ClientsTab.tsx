
import { useClientOverview } from "@/hooks/use-client-overview";
import { useClientProgress } from "@/hooks/use-client-progress";
import ClientActivityFeed from "@/components/clients/ClientActivityFeed";
import ClientStatsOverview from "./clients/ClientStatsOverview";
import ClientProgressSection from "./clients/ClientProgressSection";
import { ContentCard } from "@/components/ui/content-card";
import { ClientTaskProgress } from "@/types/client";

export default function ClientsTab() {
  const {
    clientOverview,
    isLoadingOverview
  } = useClientOverview();

  const {
    clientProgress,
    isLoading: isLoadingProgress
  } = useClientProgress();
  
  // Convert ClientProgressItem[] to ClientTaskProgress[]
  const formattedProgress: ClientTaskProgress[] = clientProgress ? 
    clientProgress.map(item => ({
      clientName: item.clientName,
      email: item.email,
      completed: item.completed,
      total: item.total,
      percentage: (item.completed / (item.total || 1)) * 100,
      lastActive: item.lastActive,
      // Add these properties to match ClientTaskProgress interface
      intakeForm: false,
      designPicker: false,
      templates: false
    })) : [];
  
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
          clientProgress={formattedProgress}
          isLoading={isLoadingProgress}
          limit={5}
        />
      </div>
    </div>
  );
}
