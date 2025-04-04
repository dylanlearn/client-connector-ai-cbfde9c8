
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
      
      // Build query
      let query = supabase
        .from('wireframe_generation_metrics')
        .select('*')
        .gte('created_at', startDate.toISOString());
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate metrics
      const totalCount = data.length;
      const successCount = data.filter(item => item.success).length;
      const failureCount = totalCount - successCount;
      const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;
      
      // Calculate average generation time
      const successfulGenerations = data.filter(item => item.success && item.generation_time);
      const totalTime = successfulGenerations.reduce((sum, item) => sum + (item.generation_time || 0), 0);
      const averageGenerationTime = successfulGenerations.length > 0 
        ? totalTime / successfulGenerations.length 
        : 0;
      
      return {
        averageGenerationTime,
        successRate,
        totalCount,
        successCount,
        failureCount,
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
      
      // Get wireframes from the time period
      const { data: wireframes, error } = await supabase
        .from('ai_wireframes')
        .select('generation_params')
        .gte('created_at', startDate.toISOString());
      
      if (error) throw error;
      
      // Extract sections from wireframe data
      const sectionCounts: Record<string, number> = {};
      let totalSections = 0;
      
      wireframes.forEach(wireframe => {
        const params = wireframe.generation_params || {};
        const resultData = params.result_data || {};
        const sections = resultData.sections || [];
        
        sections.forEach((section: any) => {
          const sectionType = section.sectionType || 'unknown';
          sectionCounts[sectionType] = (sectionCounts[sectionType] || 0) + 1;
          totalSections++;
        });
      });
      
      // Convert to expected output format
      const result: WireframeSections = {};
      
      Object.entries(sectionCounts).forEach(([sectionType, count]) => {
        result[sectionType] = {
          count,
          percentage: totalSections > 0 ? (count / totalSections) * 100 : 0
        };
      });
      
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
      await supabase
        .from('wireframe_system_events')
        .insert({
          event_type: eventType,
          details,
          severity
        });
    } catch (error) {
      console.error('Error recording system event:', error);
    }
  }
};
