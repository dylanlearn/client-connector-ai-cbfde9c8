
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type DesignAnalytics = {
  id: string;
  category: string;
  design_option_id: string;
  title: string;
  average_rank: number;
  selection_count: number;
  updated_at: string;
}

export type UserPreference = {
  id: string;
  user_id: string;
  category: string;
  design_option_id: string;
  title: string;
  rank: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [isRealtime, setIsRealtime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch analytics data with caching and proper keys
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['design-analytics', user?.id, lastUpdated],
    queryFn: async () => {
      if (!user) return [];
      
      // Only fetch analytics for this user's design preferences
      const { data: userPrefs } = await supabase
        .from('design_preferences')
        .select('design_option_id')
        .eq('user_id', user.id);
      
      if (!userPrefs || userPrefs.length === 0) return [];
      
      const designOptionIds = userPrefs.map(pref => pref.design_option_id);
      
      const { data, error } = await supabase
        .from('design_analytics')
        .select('*')
        .in('design_option_id', designOptionIds)
        .order('selection_count', { ascending: false });

      if (error) throw error;
      return data as DesignAnalytics[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch user preferences with caching
  const {
    data: userPreferences,
    isLoading: isLoadingPreferences,
    error: preferencesError,
    refetch: refetchPreferences
  } = useQuery({
    queryKey: ['user-preferences', user?.id, lastUpdated],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('design_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserPreference[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Setup optimized realtime subscription - ONLY for user's own data
  useEffect(() => {
    if (!user) return;

    // Only subscribe to the user's own preferences
    const preferencesChannel = supabase.channel('user-preferences-changes')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'design_preferences', 
          filter: `user_id=eq.${user.id}` 
        },
        (payload) => {
          console.log('User preferences update:', payload);
          setLastUpdated(new Date()); // Trigger refetch via key change
          setIsRealtime(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(preferencesChannel);
    };
  }, [user]);

  // Memoized helper functions to prevent unnecessary recalculations
  const getTopRankedDesigns = useMemo(() => {
    return (limit = 5) => {
      if (!analytics) return [];
      
      return analytics
        .sort((a, b) => a.average_rank - b.average_rank)
        .slice(0, limit)
        .map(item => ({
          title: item.title,
          averageRank: item.average_rank,
          count: item.selection_count
        }));
    };
  }, [analytics]);

  const getCategoryDistribution = useMemo(() => {
    return () => {
      if (!analytics) return [];
      
      const categories: Record<string, number> = {};
      
      analytics.forEach(item => {
        if (!categories[item.category]) {
          categories[item.category] = 0;
        }
        categories[item.category] += item.selection_count;
      });
      
      // Convert to percentage
      const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
      
      return Object.entries(categories).map(([name, value]) => {
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
        return {
          name,
          value: percentage,
          // Maintain consistent colors from our gradient
          color: name === 'hero' ? '#ee682b' : 
                 name === 'navbar' ? '#ec7f00' : 
                 name === 'about' ? '#af5cf7' : 
                 name === 'footer' ? '#8439e9' : 
                 '#6142e7'
        };
      });
    };
  }, [analytics]);

  const getPreferenceOverview = useMemo(() => {
    return () => {
      if (!analytics) return [];
      
      const categories = ['Hero', 'Navbar', 'About', 'Footer', 'Font'];
      const categoryData: Record<string, { count: number, total: number }> = {};
      
      analytics.forEach(item => {
        const cat = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        if (!categoryData[cat]) {
          categoryData[cat] = { count: 0, total: 0 };
        }
        categoryData[cat].count += item.selection_count;
        categoryData[cat].total += 1;
      });
      
      return categories.map(category => {
        const data = categoryData[category] || { count: 0, total: 0 };
        const percentage = data.total > 0 ? Math.round((data.count / (data.total * 5)) * 100) : 0;
        return { category, percentage };
      });
    };
  }, [analytics]);

  return {
    analytics,
    userPreferences,
    isLoading: isLoadingAnalytics || isLoadingPreferences,
    error: analyticsError || preferencesError,
    isRealtime,
    getTopRankedDesigns,
    getCategoryDistribution,
    getPreferenceOverview
  };
};
