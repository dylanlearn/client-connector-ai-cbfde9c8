
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HeatmapDataPoint } from "@/types/analytics";

export const useHeatmapData = (userId: string | undefined) => {
  const [heatmapData, setHeatmapData] = useState<{
    clicks: HeatmapDataPoint[],
    hover: HeatmapDataPoint[],
    attention: HeatmapDataPoint[]
  }>({
    clicks: [],
    hover: [],
    attention: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('homepage');

  // Fetch heatmap data from the database
  const fetchHeatmapData = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Fetch click data
      const { data: clickData, error: clickError } = await supabase
        .from('interaction_events')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', 'click')
        .eq('page_url', `/${selectedPage}`)
        .order('timestamp', { ascending: false })
        .limit(500);
        
      if (clickError) throw clickError;
      
      // Fetch hover data
      const { data: hoverData, error: hoverError } = await supabase
        .from('interaction_events')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', 'hover')
        .eq('page_url', `/${selectedPage}`)
        .order('timestamp', { ascending: false })
        .limit(500);
        
      if (hoverError) throw hoverError;
      
      // Create data points from the raw data
      const clickPoints = processInteractionData(clickData || []);
      const hoverPoints = processInteractionData(hoverData || []);
      
      // Generate synthetic attention data based on clicks and hovers
      // In a real implementation, this would come from actual attention tracking
      const attentionPoints = generateAttentionData(clickPoints, hoverPoints);
      
      setHeatmapData({
        clicks: clickPoints,
        hover: hoverPoints,
        attention: attentionPoints
      });
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedPage]);
  
  // Process the interaction data into heatmap data points
  const processInteractionData = (data: any[]): HeatmapDataPoint[] => {
    // Count occurrences of similar positions
    const positionCounts: Record<string, { count: number, point: HeatmapDataPoint }> = {};
    
    data.forEach(item => {
      // Round to nearest 5 pixels to aggregate nearby points
      const x = Math.round(item.x_position / 5) * 5;
      const y = Math.round(item.y_position / 5) * 5;
      const key = `${x}-${y}`;
      
      if (!positionCounts[key]) {
        positionCounts[key] = {
          count: 0,
          point: {
            x,
            y,
            value: 0,
            element: item.element_selector
          }
        };
      }
      
      positionCounts[key].count += 1;
    });
    
    // Convert to array and normalize values
    const points = Object.values(positionCounts).map(({ count, point }) => ({
      ...point,
      value: count
    }));
    
    // Sort by value descending
    return points.sort((a, b) => b.value - a.value);
  };
  
  // Generate synthetic attention data
  const generateAttentionData = (
    clicks: HeatmapDataPoint[], 
    hovers: HeatmapDataPoint[]
  ): HeatmapDataPoint[] => {
    // Combine click and hover data with click having more weight
    const combinedPoints: Record<string, HeatmapDataPoint> = {};
    
    clicks.forEach(point => {
      const key = `${point.x}-${point.y}`;
      combinedPoints[key] = {
        ...point,
        value: point.value * 1.5 // Clicks have 1.5x the weight of hovers
      };
    });
    
    hovers.forEach(point => {
      const key = `${point.x}-${point.y}`;
      if (combinedPoints[key]) {
        combinedPoints[key].value += point.value * 0.7;
      } else {
        combinedPoints[key] = {
          ...point,
          value: point.value * 0.7
        };
      }
    });
    
    return Object.values(combinedPoints).sort((a, b) => b.value - a.value);
  };
  
  // Update data when userId or selected page changes
  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData, userId, selectedPage]);
  
  return {
    heatmapData,
    isLoading,
    selectedPage,
    setSelectedPage,
    refetch: fetchHeatmapData
  };
};
