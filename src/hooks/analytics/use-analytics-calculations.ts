
import { DesignAnalytics } from "@/types/analytics";
import { useMemo } from "react";

export const useAnalyticsCalculations = (analytics: DesignAnalytics[] | undefined) => {
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

  // New function for preference timeline
  const getPreferenceTimeline = useMemo(() => {
    return () => {
      // Sample data - in production this would come from analytics with timestamps
      return [
        { date: 'Week 1', Hero: 3.2, Navbar: 4.1, Footer: 3.8 },
        { date: 'Week 2', Hero: 3.5, Navbar: 3.9, Footer: 3.8 },
        { date: 'Week 3', Hero: 3.8, Navbar: 4.0, Footer: 3.6 },
        { date: 'Week 4', Hero: 4.0, Navbar: 4.2, Footer: 3.7 },
        { date: 'Week 5', Hero: 4.3, Navbar: 4.3, Footer: 3.9 },
        { date: 'Week 6', Hero: 4.5, Navbar: 4.2, Footer: 4.0 },
      ];
    };
  }, [analytics]);

  // New function for heatmap data
  const getHeatmapData = useMemo(() => {
    return () => {
      // In production, this would fetch actual heatmap data
      return {
        // Sample structure for heatmap data
        clicks: [
          { x: 120, y: 80, value: 25 },
          { x: 250, y: 150, value: 40 },
          // more data points...
        ],
        movement: [
          // movement tracking data...
        ],
        attention: [
          // attention data...
        ]
      };
    };
  }, []);

  // New function for conversion funnel data
  const getConversionFunnelData = useMemo(() => {
    return () => {
      // In production, this would fetch actual funnel data
      return [
        { stage: 'Visit', count: 1000 },
        { stage: 'Interact', count: 750 },
        { stage: 'Sign Up', count: 450 },
        { stage: 'Convert', count: 200 },
      ];
    };
  }, []);

  return {
    getTopRankedDesigns,
    getCategoryDistribution,
    getPreferenceOverview,
    getPreferenceTimeline,
    getHeatmapData,
    getConversionFunnelData
  };
};
