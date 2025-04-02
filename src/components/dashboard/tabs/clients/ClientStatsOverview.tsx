
import { ClientOverview } from "@/types/client";
import ClientStatCard from "./ClientStatCard";
import { Users, CheckSquare, AlertCircle, BarChart } from "lucide-react";

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
        icon={<Users className="h-4 w-4" />}
        description="All-time clients"
      />
      
      <ClientStatCard 
        title="Active Clients" 
        value={clientOverview?.activeClients || 0} 
        isLoading={isLoading}
        icon={<Users className="h-4 w-4" />}
        description="Current active projects"
      />
      
      <ClientStatCard 
        title="Tasks Completed" 
        value={clientOverview?.completedTasks || 0} 
        isLoading={isLoading}
        icon={<CheckSquare className="h-4 w-4" />}
        description={`${clientOverview?.pendingTasks || 0} pending`}
      />
      
      <ClientStatCard 
        title="Overall Completion" 
        value={`${Math.round(clientOverview?.completionRate || 0)}%`} 
        isLoading={isLoading}
        icon={<BarChart className="h-4 w-4" />}
        description="Average task completion"
      />
    </div>
  );
}
