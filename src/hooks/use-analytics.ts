
import { useState, useEffect } from 'react';

interface AnalyticsData {
  id: string;
  type: string;
  value: number;
  label: string;
  date: string;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          // Mock data
          setAnalytics([
            {
              id: '1',
              type: 'preference',
              value: 65,
              label: 'Modern design',
              date: new Date().toISOString()
            },
            {
              id: '2',
              type: 'preference',
              value: 42,
              label: 'Minimalist',
              date: new Date().toISOString()
            }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analytics, isLoading };
}
