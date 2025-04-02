
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { DesignAnalytics, UserPreference } from "@/types/analytics";
import { useAnalyticsCalculations } from "./analytics/use-analytics-calculations";
import { 
  fetchAnalyticsData, 
  fetchUserPreferences, 
  getUserDesignOptionIds,
  subscribeToUserPreferences
} from "./analytics/use-analytics-api";
import { useSubscription } from "./use-subscription";

export type { DesignAnalytics, UserPreference };

export const useAnalytics = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
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
      const designOptionIds = await getUserDesignOptionIds(user.id);
      
      if (designOptionIds.length === 0) return [];
      
      return fetchAnalyticsData(user.id, designOptionIds);
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
      return fetchUserPreferences(user.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Setup optimized realtime subscription - ONLY for user's own data
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserPreferences(user.id, () => {
      setLastUpdated(new Date()); // Trigger refetch via key change
      setIsRealtime(true);
    });

    return unsubscribe;
  }, [user]);

  // Get the calculation functions
  const {
    getTopRankedDesigns,
    getCategoryDistribution,
    getPreferenceOverview,
    getPreferenceTimeline,
    getHeatmapData,
    getConversionFunnelData
  } = useAnalyticsCalculations(analytics);

  return {
    analytics,
    userPreferences,
    isLoading: isLoadingAnalytics || isLoadingPreferences,
    error: analyticsError || preferencesError,
    isRealtime,
    isPro: isPro || (user?.role === 'admin'),
    getTopRankedDesigns,
    getCategoryDistribution,
    getPreferenceOverview,
    getPreferenceTimeline,
    getHeatmapData,
    getConversionFunnelData
  };
};
