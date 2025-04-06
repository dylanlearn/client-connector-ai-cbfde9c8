
import { useState, useEffect } from 'react';

export interface AnalyticsData {
  id: string;
  type: string;
  value: number;
  label: string;
  date: string;
  title?: string;
  average_rank?: number;
  selection_count?: number;
}

export interface UserPreference {
  id: string;
  designId: string;
  title: string;
  rank: number;
  category: string;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtime, setIsRealtime] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);

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
              date: new Date().toISOString(),
              title: 'Modern design',
              average_rank: 1.8,
              selection_count: 42
            },
            {
              id: '2',
              type: 'preference',
              value: 42,
              label: 'Minimalist',
              date: new Date().toISOString(),
              title: 'Minimalist',
              average_rank: 2.3,
              selection_count: 35
            }
          ]);
          
          setUserPreferences([
            {
              id: '1',
              designId: 'design1',
              title: 'Modern design',
              rank: 1,
              category: 'style'
            },
            {
              id: '2',
              designId: 'design2',
              title: 'Minimalist',
              rank: 2,
              category: 'style'
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

  // Analytics utility functions
  const getPreferenceOverview = () => {
    return analytics.filter(item => item.type === 'preference');
  };
  
  const getCategoryDistribution = () => {
    const categories = {};
    userPreferences.forEach(pref => {
      categories[pref.category] = (categories[pref.category] || 0) + 1;
    });
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count
    }));
  };
  
  const getTopRankedDesigns = () => {
    return [...userPreferences].sort((a, b) => a.rank - b.rank).slice(0, 5);
  };
  
  const getPreferenceTimeline = () => {
    return analytics.map(item => ({
      date: new Date(item.date),
      value: item.value,
      label: item.label
    }));
  };

  return { 
    analytics, 
    isLoading,
    isRealtime,
    userPreferences,
    getPreferenceOverview,
    getCategoryDistribution,
    getTopRankedDesigns,
    getPreferenceTimeline
  };
}
