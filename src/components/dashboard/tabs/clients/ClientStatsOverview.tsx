
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "@/components/ui/content-card";
import { Users, Activity, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientStatsOverviewProps {
  clientOverview: {
    totalClients?: number;
    activeClients?: number;
    completionRate?: number;
  } | null;
  isLoading: boolean;
}

const ClientStatsOverview = ({ clientOverview, isLoading }: ClientStatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{clientOverview?.totalClients || 0}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Clients</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{clientOverview?.activeClients || 0}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="bg-primary/10 rounded-full p-2">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">
                {clientOverview?.completionRate ? `${clientOverview.completionRate}%` : '0%'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientStatsOverview;
