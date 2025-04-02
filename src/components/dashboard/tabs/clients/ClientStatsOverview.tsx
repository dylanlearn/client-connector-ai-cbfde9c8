
import { ClientOverview } from "@/types/client";
import ClientStatCard from "./ClientStatCard";

interface ClientStatsOverviewProps {
  clientOverview: ClientOverview | null;
  isLoading: boolean;
}

export default function ClientStatsOverview({ clientOverview, isLoading }: ClientStatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ClientStatCard 
        title="Total Clients" 
        value={clientOverview?.totalClients || 0} 
        isLoading={isLoading} 
      />
      
      <ClientStatCard 
        title="Active Clients" 
        value={clientOverview?.activeClients || 0} 
        isLoading={isLoading} 
      />
      
      <ClientStatCard 
        title="Tasks Completed" 
        value={clientOverview?.completedTasks || 0} 
        isLoading={isLoading} 
      />
      
      <ClientStatCard 
        title="Overall Completion" 
        value={`${Math.round(clientOverview?.completionRate || 0)}%`} 
        isLoading={isLoading} 
      />
    </div>
  );
}
