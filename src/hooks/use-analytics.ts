
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
  category?: string;
  percentage?: number;
}

export interface UserPreference {
  id: string;
  designId: string;
  title: string;
  rank: number;
  category: string;
  notes?: string;
  design_option_id: string; // Required to match the type in analytics.ts
  averageRank?: number;
  count?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
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
              selection_count: 42,
              category: 'Modern design',
              percentage: 65
            },
            {
              id: '2',
              type: 'preference',
              value: 42,
              label: 'Minimalist',
              date: new Date().toISOString(),
              title: 'Minimalist',
              average_rank: 2.3,
              selection_count: 35,
              category: 'Minimalist',
              percentage: 42
            }
          ]);
          
          setUserPreferences([
            {
              id: '1',
              designId: 'design1',
              design_option_id: 'design1', // Ensuring this is set in the mock data
              title: 'Modern design',
              rank: 1,
              category: 'style',
              notes: 'Great design',
              averageRank: 1.8,
              count: 42,
              user_id: 'user1',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              designId: 'design2',
              design_option_id: 'design2', // Ensuring this is set in the mock data
              title: 'Minimalist',
              rank: 2,
              category: 'style',
              notes: 'Clean and simple',
              averageRank: 2.3,
              count: 35,
              user_id: 'user2',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
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
    const categories = {} as Record<string, number>;
    userPreferences.forEach(pref => {
      categories[pref.category] = (categories[pref.category] || 0) + 1;
    });
    
    // Convert to array with percentage calculations
    const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      value: Math.round((count / total) * 100),
      color: getColorForCategory(category)
    }));
  };
  
  const getColorForCategory = (category: string) => {
    const colors = {
      'style': '#ee682b',
      'layout': '#8439e9',
      'typography': '#6142e7',
      'color': '#3f9cff',
      'component': '#18ccb6'
    };
    return (colors as Record<string, string>)[category.toLowerCase()] || '#6142e7';
  };
  
  const getTopRankedDesigns = (limit = 4) => {
    return [...userPreferences].sort((a, b) => a.rank - b.rank).slice(0, limit);
  };
  
  const getPreferenceTimeline = () => {
    return analytics.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      [item.title || 'Value']: item.value,
      category: item.category
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
