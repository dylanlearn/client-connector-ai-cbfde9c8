
import { useState, useEffect } from 'react';

interface ClientOverview {
  totalClients: number;
  activeClients: number;
  pendingTasks: number;
  completedTasks: number;
  recentActivity: Array<{
    id: string;
    type: string;
    clientName: string;
    timestamp: string;
    details: string;
  }>;
}

export function useClientOverview() {
  const [clientOverview, setClientOverview] = useState<ClientOverview>({
    totalClients: 0,
    activeClients: 0,
    pendingTasks: 0,
    completedTasks: 0,
    recentActivity: []
  });
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);

  useEffect(() => {
    const fetchClientOverview = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          // Mock data
          setClientOverview({
            totalClients: 5,
            activeClients: 3,
            pendingTasks: 8,
            completedTasks: 15,
            recentActivity: [
              {
                id: '1',
                type: 'task_completed',
                clientName: 'Acme Corp',
                timestamp: new Date().toISOString(),
                details: 'Completed wireframe selection'
              },
              {
                id: '2',
                type: 'client_added',
                clientName: 'XYZ Industries',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                details: 'Added new client to the system'
              }
            ]
          });
          setIsLoadingOverview(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching client overview:', error);
        setIsLoadingOverview(false);
      }
    };

    fetchClientOverview();
  }, []);

  return { clientOverview, isLoadingOverview };
}
