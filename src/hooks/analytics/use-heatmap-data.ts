
import { useState, useEffect, useCallback } from "react";
import { HeatmapDataPoint } from "@/types/analytics";
import { supabase } from "@/integrations/supabase/client";

export type HeatmapFilterOptions = {
  eventType?: 'click' | 'hover' | 'scroll' | 'view' | 'movement';
  pageUrl?: string;
  startDate?: string;
  endDate?: string;
  deviceType?: string;
  sessionId?: string;
  aggregationType?: 'density' | 'time' | 'element';
}

export const useHeatmapData = (userId: string | undefined) => {
  const [heatmapData, setHeatmapData] = useState<{
    clicks: HeatmapDataPoint[],
    hover: HeatmapDataPoint[],
    scrolls: HeatmapDataPoint[],
    movements: HeatmapDataPoint[],
    attention: HeatmapDataPoint[]
  }>({
    clicks: [],
    hover: [],
    scrolls: [],
    movements: [],
    attention: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('pricing');

  // Fetch heatmap data from the Edge Function
  const fetchHeatmapData = useCallback(async (options: HeatmapFilterOptions = {}) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch click data
      const { data: clickData, error: clickError } = await supabase.functions.invoke(
        'get-heatmap-data',
        {
          body: {
            userId,
            eventType: 'click',
            pageUrl: `/${options.pageUrl || selectedPage}`,
            startDate: options.startDate,
            endDate: options.endDate,
            deviceType: options.deviceType,
            sessionId: options.sessionId,
            aggregationType: options.aggregationType || 'density'
          }
        }
      );
      
      if (clickError) throw new Error(clickError.message);
      
      // Fetch hover data
      const { data: hoverData, error: hoverError } = await supabase.functions.invoke(
        'get-heatmap-data',
        {
          body: {
            userId,
            eventType: 'hover',
            pageUrl: `/${options.pageUrl || selectedPage}`,
            startDate: options.startDate,
            endDate: options.endDate,
            deviceType: options.deviceType,
            sessionId: options.sessionId,
            aggregationType: options.aggregationType || 'density'
          }
        }
      );
      
      if (hoverError) throw new Error(hoverError.message);
      
      // Fetch scroll data
      const { data: scrollData, error: scrollError } = await supabase.functions.invoke(
        'get-heatmap-data',
        {
          body: {
            userId,
            eventType: 'scroll',
            pageUrl: `/${options.pageUrl || selectedPage}`,
            startDate: options.startDate,
            endDate: options.endDate,
            deviceType: options.deviceType,
            sessionId: options.sessionId,
            aggregationType: options.aggregationType || 'density'
          }
        }
      );
      
      if (scrollError) throw new Error(scrollError.message);
      
      // Fetch movement data
      const { data: movementData, error: movementError } = await supabase.functions.invoke(
        'get-heatmap-data',
        {
          body: {
            userId,
            eventType: 'movement',
            pageUrl: `/${options.pageUrl || selectedPage}`,
            startDate: options.startDate,
            endDate: options.endDate,
            deviceType: options.deviceType,
            sessionId: options.sessionId,
            aggregationType: options.aggregationType || 'density'
          }
        }
      );
      
      if (movementError) throw new Error(movementError.message);
      
      // Generate attention data
      const attentionData = generateAttentionData(
        clickData?.data || [],
        hoverData?.data || [],
        scrollData?.data || []
      );
      
      setHeatmapData({
        clicks: clickData?.data || [],
        hover: hoverData?.data || [],
        scrolls: scrollData?.data || [],
        movements: movementData?.data || [],
        attention: attentionData
      });
    } catch (err: any) {
      console.error('Error fetching heatmap data:', err);
      setError(err.message || 'Failed to fetch heatmap data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedPage]);
  
  // Generate synthetic attention data
  const generateAttentionData = (
    clicks: HeatmapDataPoint[], 
    hovers: HeatmapDataPoint[],
    scrolls: HeatmapDataPoint[]
  ): HeatmapDataPoint[] => {
    // Combine click, hover and scroll data with different weights
    const combinedPoints: Record<string, HeatmapDataPoint> = {};
    
    clicks.forEach(point => {
      const key = `${point.x}-${point.y}`;
      combinedPoints[key] = {
        ...point,
        value: point.value * 1.5 // Clicks have 1.5x the weight
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
    
    scrolls.forEach(point => {
      const key = `${point.x}-${point.y}`;
      if (combinedPoints[key]) {
        combinedPoints[key].value += point.value * 0.3;
      } else {
        combinedPoints[key] = {
          ...point,
          value: point.value * 0.3
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
    error,
    selectedPage,
    setSelectedPage,
    fetchHeatmapData
  };
};
