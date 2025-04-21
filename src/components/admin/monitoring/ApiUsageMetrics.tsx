import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiMetricsHeader } from "./api-metrics/ApiMetricsHeader";
import { ApiMetricsOverview } from "./api-metrics/ApiMetricsOverview";
import { ApiRequestsTable } from "./api-metrics/ApiRequestsTable";
import { toast } from "sonner";

export interface ApiUsageMetricsProps {
  refreshInterval?: number;
  limit?: number;
}

interface ApiMetric {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  request_timestamp: string;
  user_id?: string;
  ip_address?: string;
  error_message?: string;
  request_payload?: any;
}

export function ApiUsageMetrics({
  refreshInterval = 30,
  limit = 10
}: ApiUsageMetricsProps) {
  const [metrics, setMetrics] = useState<ApiMetric[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchApiUsageData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: metricsData, error: metricsError } = await supabase
        .from('api_usage_metrics')
        .select('*')
        .order('request_timestamp', { ascending: false })
        .limit(limit);
        
      if (metricsError) {
        throw metricsError;
      }
      
      setMetrics(metricsData || []);
      
      if (metricsData && metricsData.length > 0) {
        const endpointCounts: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};
        let totalResponseTime = 0;
        
        metricsData.forEach((metric: ApiMetric) => {
          endpointCounts[metric.endpoint] = (endpointCounts[metric.endpoint] || 0) + 1;
          const statusGroup = Math.floor(metric.status_code / 100) * 100;
          const statusKey = `${statusGroup}`;
          statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
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
    
    const channel = supabase.channel('api-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'api_usage_metrics'
        },
        (payload) => {
          console.log('New API request tracked:', payload);
          fetchApiUsageData();
          toast.info("New API request detected", {
            description: `${payload.new.method} ${payload.new.endpoint}`
          });
        }
      )
      .subscribe();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchApiUsageData, refreshInterval * 1000);
      return () => {
        clearInterval(intervalId);
        supabase.removeChannel(channel);
      };
    }
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshInterval, limit]);

  return (
    <div className="rounded-lg border p-4">
      <ApiMetricsHeader onRefresh={fetchApiUsageData} isLoading={isLoading} />
      
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
          <div className="mb-2 text-sm text-muted-foreground">
            Monitor API usage patterns. Watch for high response times (&gt;300ms) or error rates above 5% that may indicate issues.
          </div>
          <ApiMetricsOverview summary={summary} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="recent">
          <ApiRequestsTable metrics={metrics} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
