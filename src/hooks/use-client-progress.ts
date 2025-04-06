
import { useState, useEffect } from 'react';

interface ClientProgressItem {
  id: string;
  clientName: string;
  email: string;
  completed: number;
  total: number;
  percentage?: number;
  lastActive: string;
}

export function useClientProgress() {
  const [clientProgress, setClientProgress] = useState<ClientProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientProgress = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          // Mock data
          setClientProgress([
            {
              id: '1',
              clientName: 'Acme Corp',
              email: 'contact@acme.com',
              completed: 3,
              total: 5,
              percentage: 60,
              lastActive: new Date().toISOString()
            },
            {
              id: '2',
              clientName: 'XYZ Industries',
              email: 'hello@xyz.co',
              completed: 1,
              total: 4,
              percentage: 25,
              lastActive: new Date(Date.now() - 172800000).toISOString()
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching client progress:', error);
        setIsLoading(false);
      }
    };

    fetchClientProgress();
  }, []);

  return { clientProgress, isLoading };
}
