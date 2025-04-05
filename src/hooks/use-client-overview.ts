
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ClientOverview } from '@/types/client';

export function useClientOverview() {
  const { user } = useAuth();
  const [clientOverview, setClientOverview] = useState<ClientOverview | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClientOverview = async () => {
      if (!user) return;
      
      setIsLoadingOverview(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For now, return mock data after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setClientOverview({
          totalClients: 12,
          activeClients: 8,
          completionRate: 75
        });
      } catch (err) {
        console.error("Error fetching client overview:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoadingOverview(false);
      }
    };
    
    fetchClientOverview();
  }, [user]);
  
  return {
    clientOverview,
    isLoadingOverview,
    error
  };
}
