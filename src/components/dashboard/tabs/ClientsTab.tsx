
import { useClientOverview } from "@/hooks/use-client-overview";
import ClientActivityFeed from "@/components/clients/ClientActivityFeed";
import ClientStatsOverview from "./clients/ClientStatsOverview";
import ClientProgressSection from "./clients/ClientProgressSection";

export default function ClientsTab() {
  const {
    clientOverview,
    clientProgress,
    isLoadingOverview,
    isLoadingProgress
  } = useClientOverview();
  
  return (
    <div className="space-y-6">
      {/* Client stats overview */}
      <ClientStatsOverview 
        clientOverview={clientOverview} 
        isLoading={isLoadingOverview} 
      />
      
      {/* Client activity and progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientActivityFeed />
        <ClientProgressSection
          clientProgress={clientProgress}
          isLoading={isLoadingProgress}
        />
      </div>
    </div>
  );
}
