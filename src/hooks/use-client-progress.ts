
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ClientProgressItem } from '@/types/client';

export function useClientProgress() {
  const { user } = useAuth();
  const [clientProgress, setClientProgress] = useState<ClientProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClientProgress = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For now, return mock data after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setClientProgress([
          {
            clientName: 'Jane Smith',
            email: 'jane.smith@example.com',
            completed: 4,
            total: 5,
            percentage: 80,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            clientName: 'Robert Johnson',
            email: 'robert@example.com',
            completed: 2,
            total: 5,
            percentage: 40,
            lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          },
          {
            clientName: 'Sarah Miller',
            email: 'sarah@example.com',
            completed: 3,
            total: 5,
            percentage: 60,
            lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      } catch (err) {
        console.error("Error fetching client progress:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientProgress();
  }, [user]);
  
  return {
    clientProgress,
    isLoading,
    error
  };
}
