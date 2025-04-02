import { useState, useEffect } from "react";
import { BarChart2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RateLimiterStatusProps {
  endpoint?: string;
  refreshInterval?: number;
  showDetails?: boolean;
}

interface RateLimitCounter {
  id: string;
  key: string;
  endpoint: string;
  tokens: number;
  last_refill: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

export function RateLimiterStatus({
  endpoint = "all",
  refreshInterval = 30,
  showDetails = true
}: RateLimiterStatusProps) {
  const [rateLimits, setRateLimits] = useState<RateLimitCounter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRateLimitData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('rate_limit_counters' as any).select('*') as any;
      
      if (endpoint !== 'all') {
        query = query.eq('endpoint', endpoint);
      }
      
      const { data, error } = await query.order('last_refill', { ascending: false }).limit(10);
      
      if (error) {
        throw error;
      }
      
      setRateLimits(data || []);
    } catch (error: any) {
      console.error('Error fetching rate limit data:', error);
      setError(error.message || 'Failed to load rate limiter data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRateLimitData();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchRateLimitData, refreshInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [endpoint, refreshInterval]);

  const getLimiterHealth = () => {
    if (rateLimits.length === 0) return 'unknown';
    
    const nearExhaustion = rateLimits.some(limit => limit.tokens < 3);
    
    if (nearExhaustion) {
      return 'warning';
    }
    
    return 'healthy';
  };

  const health = getLimiterHealth();

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Rate Limiter Status</h3>
        </div>
        
        <Button variant="ghost" size="sm" onClick={fetchRateLimitData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            health === 'healthy' ? 'bg-green-100 text-green-800' : 
            health === 'warning' ? 'bg-amber-100 text-amber-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {health === 'healthy' ? 'HEALTHY' : 
             health === 'warning' ? 'WARNING' : 
             'UNKNOWN'}
          </span>
        </div>
        
        {endpoint !== 'all' && (
          <div className="text-sm">
            <span className="font-medium">Endpoint:</span> {endpoint}
          </div>
        )}
        
        {error && (
          <div className="text-sm text-red-500 mt-2">
            Error: {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          showDetails && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Rate Limits ({rateLimits.length})</h4>
              
              {rateLimits.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rate limit data available</p>
              ) : (
                <div className="text-xs max-h-48 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Key</th>
                        <th className="text-left pb-2">Endpoint</th>
                        <th className="text-right pb-2">Tokens</th>
                        <th className="text-right pb-2">Last Refill</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateLimits.map((limit) => (
                        <tr key={limit.id} className="border-b border-gray-100">
                          <td className="py-1">{limit.key}</td>
                          <td className="py-1">{limit.endpoint}</td>
                          <td className="py-1 text-right">{limit.tokens}</td>
                          <td className="py-1 text-right">
                            {new Date(limit.last_refill).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
