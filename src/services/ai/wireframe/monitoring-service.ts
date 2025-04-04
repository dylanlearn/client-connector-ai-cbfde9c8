
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
      
      // Get metrics using edge function
      const { data, error } = await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "get_metrics",
          start_date: startDate.toISOString(),
          project_id: projectId || null
        }
      });
      
      if (error) throw error;
      
      if (!data || !data.metrics) {
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
      
      const metrics = data.metrics;
      
      return {
        averageGenerationTime: metrics.average_generation_time || 0,
        successRate: metrics.success_rate || 0,
        totalCount: metrics.total_count || 0,
        successCount: metrics.success_count || 0,
        failureCount: metrics.failure_count || 0,
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
      
      // Get section analysis using edge function
      const { data, error } = await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "analyze_sections",
          start_date: startDate.toISOString()
        }
      });
      
      if (error) throw error;
      
      // Convert to expected output format
      const result: WireframeSections = {};
      
      if (data && data.sections && Array.isArray(data.sections)) {
        data.sections.forEach((item: any) => {
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
      await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "record_event",
          event_type: eventType,
          details: details,
          severity: severity
        }
      });
    } catch (error) {
      console.error('Error recording system event:', error);
    }
  }
};
