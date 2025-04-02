
import { useState, useEffect } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiUsageMetricsProps {
  refreshInterval?: number;
  limit?: number;
}

export function ApiUsageMetrics({
  refreshInterval = 30,
  limit = 10
}: ApiUsageMetricsProps) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchApiUsageData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the most recent API usage metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('api_usage_metrics')
        .select('*')
        .order('request_timestamp', { ascending: false })
        .limit(limit);
        
      if (metricsError) {
        throw metricsError;
      }
      
      setMetrics(metricsData || []);
      
      // Calculate summary statistics
      if (metricsData && metricsData.length > 0) {
        // Count by endpoint
        const endpointCounts: Record<string, number> = {};
        // Count by status code
        const statusCounts: Record<string, number> = {};
        // Calculate average response time
        let totalResponseTime = 0;
        
        metricsData.forEach(metric => {
          // Endpoint counts
          endpointCounts[metric.endpoint] = (endpointCounts[metric.endpoint] || 0) + 1;
          
          // Status code counts
          const statusGroup = Math.floor(metric.status_code / 100) * 100;
          const statusKey = `${statusGroup}`;
          statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
          
          // Sum response times
          totalResponseTime += metric.response_time_ms;
        });
        
        setSummary({
          totalRequests: metricsData.length,
          endpointCounts,
          statusCounts,
          avgResponseTime: Math.round(totalResponseTime / metricsData.length)
        });
      } else {
        setSummary({
          totalRequests: 0,
          endpointCounts: {},
          statusCounts: {},
          avgResponseTime: 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching API usage metrics:', error);
      setError(error.message || 'Failed to load API usage metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiUsageData();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchApiUsageData, refreshInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, limit]);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">API Usage Metrics</h3>
        </div>
        
        <Button variant="ghost" size="sm" onClick={fetchApiUsageData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <div className="text-sm text-red-500 mb-4">
          Error: {error}
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
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
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : metrics.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API usage data available</p>
          ) : (
            <div className="text-xs max-h-60 overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Endpoint</th>
                    <th className="text-left pb-2">Method</th>
                    <th className="text-right pb-2">Status</th>
                    <th className="text-right pb-2">Time (ms)</th>
                    <th className="text-right pb-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.id} className="border-b border-gray-100">
                      <td className="py-1 max-w-[150px] truncate">{metric.endpoint}</td>
                      <td className="py-1">{metric.method}</td>
                      <td className={`py-1 text-right ${
                        metric.status_code >= 200 && metric.status_code < 300 ? 'text-green-600' :
                        metric.status_code >= 400 && metric.status_code < 500 ? 'text-amber-600' :
                        metric.status_code >= 500 ? 'text-red-600' : ''
                      }`}>{metric.status_code}</td>
                      <td className="py-1 text-right">{metric.response_time_ms}</td>
                      <td className="py-1 text-right">
                        {new Date(metric.request_timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
