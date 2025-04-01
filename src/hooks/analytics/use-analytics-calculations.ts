
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

  return {
    getTopRankedDesigns,
    getCategoryDistribution,
    getPreferenceOverview
  };
};
