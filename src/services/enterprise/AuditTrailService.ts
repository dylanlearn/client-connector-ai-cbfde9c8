
import { AuditLog, AuditLogFilter, SystemAlert } from '@/types/audit-trail';
import { supabase } from '@/integrations/supabase/client';

export class AuditTrailService {
  /**
   * Get filtered audit logs
   */
  static async getAuditLogs(filters: AuditLogFilter = {}): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase.rpc('get_audit_logs', {
        p_start_date: filters.start_date?.toISOString(),
        p_end_date: filters.end_date?.toISOString(),
        p_user_id: filters.user_id,
        p_resource_type: filters.resource_type,
        p_action: filters.action,
        p_limit: filters.limit || 100,
        p_offset: filters.offset || 0
      });
      
      if (error) throw error;
      return data as AuditLog[];
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      return [];
    }
  }
  
  /**
   * Record a manual audit log entry
   */
  static async recordAuditLog(action: string, resourceType: string, resourceId?: string, metadata?: Record<string, any>): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('record_audit_log', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_metadata: metadata || {}
      });
      
      if (error) throw error;
      return data as string;
    } catch (err) {
      console.error('Error recording audit log:', err);
      return null;
    }
  }
  
  /**
   * Get system alerts with optional filters
   */
  static async getSystemAlerts(resolved: boolean | null = null, severity?: string): Promise<SystemAlert[]> {
    try {
      let query = supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (resolved !== null) {
        query = query.eq('is_resolved', resolved);
      }
      
      if (severity) {
        query = query.eq('severity', severity);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SystemAlert[];
    } catch (err) {
      console.error('Error fetching system alerts:', err);
      return [];
    }
  }
  
  /**
   * Resolve a system alert
   */
  static async resolveAlert(alertId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: supabase.auth.getUser().then(({ data }) => data.user?.id),
          resolution_notes: notes
        })
        .eq('id', alertId);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error resolving system alert:', err);
      return false;
    }
  }
  
  /**
   * Create a new system alert
   */
  static async createSystemAlert(severity: 'low' | 'medium' | 'high' | 'critical', message: string, component: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('create_system_alert', {
        p_severity: severity,
        p_message: message,
        p_component: component
      });
      
      if (error) throw error;
      return data as string;
    } catch (err) {
      console.error('Error creating system alert:', err);
      return null;
    }
  }
}
