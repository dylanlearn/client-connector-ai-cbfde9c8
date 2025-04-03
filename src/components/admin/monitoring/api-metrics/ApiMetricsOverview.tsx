
import { Skeleton } from "@/components/ui/skeleton";

interface ApiMetricsOverviewProps {
  summary: {
    totalRequests: number;
    avgResponseTime: number;
    endpointCounts: Record<string, number>;
    statusCounts: Record<string, number>;
  };
  isLoading: boolean;
}

export function ApiMetricsOverview({ summary, isLoading }: ApiMetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-primary/5 p-3">
          <div className="text-sm font-medium">Total Requests</div>
          <div className="text-2xl font-bold">{summary.totalRequests}</div>
        </div>
        
        <div className="rounded-lg bg-primary/5 p-3">
          <div className="text-sm font-medium">Avg Response Time</div>
          <div className="text-2xl font-bold">{summary.avgResponseTime} ms</div>
        </div>
        
        <div className="rounded-lg bg-primary/5 p-3">
          <div className="text-sm font-medium">Status Distribution</div>
          <div className="flex items-center space-x-2 mt-1">
            {Object.entries(summary.statusCounts || {}).map(([status, count]: [string, any]) => (
              <div 
                key={status} 
                className={`text-xs px-2 py-1 rounded-full ${
                  status === '200' ? 'bg-green-100 text-green-800' : 
                  status === '400' ? 'bg-amber-100 text-amber-800' : 
                  status === '500' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {status}: {count}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Top Endpoints</h4>
        <div className="space-y-2">
          {Object.entries(summary.endpointCounts || {})
            .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
            .slice(0, 5)
            .map(([endpoint, count]: [string, any]) => (
              <div key={endpoint} className="flex items-center justify-between">
                <span className="text-sm truncate">{endpoint}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
