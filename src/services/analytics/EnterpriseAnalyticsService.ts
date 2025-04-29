
import { supabase } from "@/integrations/supabase/client";
import { 
  AnalyticsDashboard, 
  AnalyticsWidget, 
  ProductivityMetric, 
  ResourceUtilization,
  MetricsSummary
} from "@/types/analytics";
import { toast } from "sonner";

export class EnterpriseAnalyticsService {
  /**
   * Get analytics dashboards for a workspace
   */
  static async getDashboards(workspaceId: string): Promise<AnalyticsDashboard[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_dashboards')
        .select('*')
        .eq('workspace_id', workspaceId);
        
      if (error) throw error;
      return data as AnalyticsDashboard[];
    } catch (err) {
      console.error("Error fetching analytics dashboards:", err);
      return [];
    }
  }
  
  /**
   * Get dashboard by ID
   */
  static async getDashboardById(id: string): Promise<AnalyticsDashboard | null> {
    try {
      const { data, error } = await supabase
        .from('analytics_dashboards')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as AnalyticsDashboard;
    } catch (err) {
      console.error(`Error fetching dashboard ${id}:`, err);
      return null;
    }
  }
  
  /**
   * Get widgets for a dashboard
   */
  static async getDashboardWidgets(dashboardId: string): Promise<AnalyticsWidget[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_widgets')
        .select('*')
        .eq('dashboard_id', dashboardId);
        
      if (error) throw error;
      return data as AnalyticsWidget[];
    } catch (err) {
      console.error(`Error fetching widgets for dashboard ${dashboardId}:`, err);
      return [];
    }
  }
  
  /**
   * Create a widget
   */
  static async createWidget(
    dashboardId: string, 
    widgetType: string, 
    title: string, 
    configuration: Record<string, any>,
    position: { x: number; y: number; },
    size: { width: number; height: number; }
  ): Promise<AnalyticsWidget | null> {
    try {
      const { data, error } = await supabase
        .from('analytics_widgets')
        .insert({
          dashboard_id: dashboardId,
          widget_type: widgetType,
          title,
          configuration,
          position_data: position,
          size_data: size
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as AnalyticsWidget;
    } catch (err) {
      console.error("Error creating widget:", err);
      toast.error("Failed to create widget");
      return null;
    }
  }
  
  /**
   * Get productivity metrics
   */
  static async getProductivityMetrics(
    workspaceId: string, 
    startDate: Date, 
    endDate: Date, 
    groupBy: string = 'user', 
    metricType?: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('aggregate_productivity_metrics', {
        p_workspace_id: workspaceId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
        p_group_by: groupBy,
        p_metric_type: metricType
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching productivity metrics:", err);
      return { metrics: [] };
    }
  }
  
  /**
   * Get resource utilization
   */
  static async getResourceUtilization(
    workspaceId: string, 
    resourceType?: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<ResourceUtilization[]> {
    try {
      const { data, error } = await supabase.rpc('get_resource_utilization', {
        p_workspace_id: workspaceId,
        p_resource_type: resourceType,
        p_start_date: startDate?.toISOString(),
        p_end_date: endDate?.toISOString()
      });
      
      if (error) throw error;
      return data?.utilization || [];
    } catch (err) {
      console.error("Error fetching resource utilization:", err);
      return [];
    }
  }
  
  /**
   * Generate project status metrics
   */
  static async getProjectStatusMetrics(workspaceId: string): Promise<Record<string, MetricsSummary>> {
    try {
      // This would normally call a backend function to fetch real metrics
      // For now, we'll return mock data
      return {
        active: {
          total: 15,
          average: 12.5,
          change: 2.5,
          trend: 'up',
          period: 'week'
        },
        completed: {
          total: 32,
          average: 28,
          change: 4,
          trend: 'up',
          period: 'week'
        },
        delayed: {
          total: 3,
          average: 5,
          change: -2,
          trend: 'down',
          period: 'week'
        }
      };
    } catch (err) {
      console.error("Error generating project status metrics:", err);
      return {};
    }
  }
  
  /**
   * Record a productivity metric
   */
  static async recordProductivityMetric(
    metric: Partial<ProductivityMetric>
  ): Promise<ProductivityMetric | null> {
    try {
      const { data, error } = await supabase
        .from('productivity_metrics')
        .insert(metric)
        .select()
        .single();
      
      if (error) throw error;
      return data as ProductivityMetric;
    } catch (err) {
      console.error("Error recording productivity metric:", err);
      return null;
    }
  }
}
