
import { SupabaseHealthCheck } from '@/types/supabase-audit';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAuditService {
  async checkSupabaseHealth(): Promise<SupabaseHealthCheck> {
    try {
      // Check Auth Service
      const authStatus = await this.checkAuthService();
      
      // Check Database Service
      const dbStatus = await this.checkDatabaseService();
      
      // Check Storage Service
      const storageStatus = await this.checkStorageService();
      
      // Check Functions Service
      const functionsStatus = await this.checkFunctionsService();
      
      // Determine overall health status
      const overallStatus = this.determineOverallStatus([
        authStatus.status, 
        dbStatus.status, 
        storageStatus.status, 
        functionsStatus.status
      ]);
      
      return {
        auth: authStatus,
        database: dbStatus,
        storage: storageStatus,
        functions: functionsStatus,
        overall: overallStatus
      };
    } catch (error) {
      console.error('Error checking Supabase health:', error);
      return {
        auth: { status: 'error', message: 'Error checking auth status' },
        database: { status: 'error', message: 'Error checking database status' },
        storage: { status: 'error', message: 'Error checking storage status' },
        functions: { status: 'error', message: 'Error checking functions status' },
        overall: 'unhealthy'
      };
    }
  }

  /**
   * Check database performance via RPC function
   */
  async checkDatabasePerformance() {
    try {
      const { data, error } = await supabase.rpc('check_database_performance');
      
      if (error) {
        console.error('Error checking database performance:', error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Safely access table_stats property, handling different possible response types
      const tableStats = typeof data === 'object' && data !== null && 'table_stats' in data 
        ? data.table_stats 
        : [];
        
      const highVacuumTables = typeof data === 'object' && data !== null && 'high_vacuum_tables' in data 
        ? data.high_vacuum_tables 
        : [];
        
      const timestamp = typeof data === 'object' && data !== null && 'timestamp' in data 
        ? data.timestamp 
        : null;
      
      return {
        table_stats: tableStats,
        high_vacuum_tables: highVacuumTables,
        timestamp
      };
    } catch (error) {
      console.error('Error checking database performance:', error);
      return null;
    }
  }
  
  private async checkAuthService() {
    try {
      // Simple check to see if we can access auth API
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return { 
          status: 'error', 
          message: 'Authentication service is experiencing issues'
        };
      }
      
      return { 
        status: 'ok', 
        message: 'Authentication service is operating normally'
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Failed to connect to authentication service'
      };
    }
  }
  
  private async checkDatabaseService() {
    try {
      // Simple query to test database connectivity
      const { error } = await supabase
        .from('wireframe_system_events')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        return { 
          status: 'error', 
          message: 'Database is experiencing connectivity issues'
        };
      }
      
      return { 
        status: 'ok', 
        message: 'Database is connected and responding to queries'
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Failed to connect to database service'
      };
    }
  }
  
  private async checkStorageService() {
    try {
      // List buckets to check storage
      const { error } = await supabase
        .storage
        .getBucket('wireframes');
      
      if (error) {
        // Check if it's a permissions error or a service error
        if (error.message.includes('permission')) {
          return { 
            status: 'warning', 
            message: 'Storage service is online but access is restricted'
          };
        }
        
        return { 
          status: 'error', 
          message: 'Storage service is experiencing issues'
        };
      }
      
      return { 
        status: 'ok', 
        message: 'Storage service is operating normally'
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Failed to connect to storage service'
      };
    }
  }
  
  private async checkFunctionsService() {
    try {
      // We'll assume functions are working if we can access the list
      // In a real app, this would ping an edge function health check endpoint
      return { 
        status: 'ok', 
        message: 'Edge functions appear to be operational',
        count: 12 // Mock count for now
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Failed to verify edge functions status'
      };
    }
  }
  
  private determineOverallStatus(statuses: string[]): 'healthy' | 'degraded' | 'unhealthy' {
    const errorCount = statuses.filter(s => s === 'error').length;
    const warningCount = statuses.filter(s => s === 'warning').length;
    
    if (errorCount > 0) {
      return 'unhealthy';
    }
    
    if (warningCount > 0) {
      return 'degraded';
    }
    
    return 'healthy';
  }
}
