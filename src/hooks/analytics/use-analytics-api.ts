
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { RPCClient } from '@/utils/supabase/rpc-client';

export function useAnalyticsAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = useErrorHandler({ componentName: 'AnalyticsAPI' });

  const fetchAnalytics = useCallback(async (period: string) => {
    setIsLoading(true);
    
    try {
      const result = await RPCClient.call('get_analytics_dashboard', 
        { time_period: period },
        { componentName: 'AnalyticsDashboard', showToast: true }
      );
      
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'fetching analytics');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [errorHandler]);

  return {
    isLoading,
    fetchAnalytics
  };
}
