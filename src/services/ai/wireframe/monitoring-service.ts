
import { supabase } from "@/integrations/supabase/client";

export interface WireframeMetrics {
  averageGenerationTime: number;
  successRate: number;
  totalCount: number;
  successCount: number;
  failureCount: number;
  timeRange: 'day' | 'week' | 'month';
  projectId?: string;
}

export interface WireframeSections {
  [sectionType: string]: {
    count: number;
    percentage: number;
  };
}

/**
 * Service for monitoring wireframe system performance and gathering analytics
 */
export const WireframeMonitoringService = {
  /**
   * Get wireframe generation metrics for a time period
   */
  getMetrics: async (timeRange: 'day' | 'week' | 'month' = 'day', projectId?: string): Promise<WireframeMetrics> => {
    try {
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'day':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      // Get metrics using RPC
      const { data, error } = await supabase.rpc('get_wireframe_metrics', {
        p_start_date: startDate.toISOString(),
        p_project_id: projectId || null
      });
      
      if (error) throw error;
      
      if (!data) {
        // Return default metrics if no data
        return {
          averageGenerationTime: 0,
          successRate: 0,
          totalCount: 0,
          successCount: 0,
          failureCount: 0,
          timeRange,
          projectId
        };
      }
      
      return {
        averageGenerationTime: data.average_generation_time || 0,
        successRate: data.success_rate || 0,
        totalCount: data.total_count || 0,
        successCount: data.success_count || 0,
        failureCount: data.failure_count || 0,
        timeRange,
        projectId
      };
    } catch (error) {
      console.error('Error fetching wireframe metrics:', error);
      return {
        averageGenerationTime: 0,
        successRate: 0,
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        timeRange
      };
    }
  },
  
  /**
   * Analyze section types used in wireframes
   */
  analyzeSectionTypes: async (timeRange: 'day' | 'week' | 'month' = 'month'): Promise<WireframeSections> => {
    try {
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'day':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      // Get wireframes from the time period using SQL stored procedure
      const { data, error } = await supabase.rpc('analyze_wireframe_sections', {
        p_start_date: startDate.toISOString()
      });
      
      if (error) throw error;
      
      // Convert to expected output format
      const result: WireframeSections = {};
      
      if (data && Array.isArray(data)) {
        data.forEach(item => {
          result[item.section_type] = {
            count: item.count,
            percentage: item.percentage
          };
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error analyzing section types:', error);
      return {};
    }
  },
  
  /**
   * Record a system event for monitoring
   */
  recordEvent: async (
    eventType: string,
    details: Record<string, any>,
    severity: 'info' | 'warning' | 'error' = 'info'
  ): Promise<void> => {
    try {
      // Use RPC instead of direct table access
      await supabase.rpc('record_system_event', {
        p_event_type: eventType,
        p_details: details,
        p_severity: severity
      });
    } catch (error) {
      console.error('Error recording system event:', error);
    }
  }
};
