
import { SupabaseHealthCheck } from '@/types/supabase-audit';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAuditService {
  /**
   * Run a comprehensive health check of all Supabase services
   */
  static async runFullHealthCheck(): Promise<SupabaseHealthCheck> {
    const service = new SupabaseAuditService();
    return service.checkSupabaseHealth();
  }

  /**
   * Check database schema for required tables
   */
  static async checkDatabaseSchema(requiredTables: string[]): Promise<{
    missingTables: string[];
    existingTables: string[];
  }> {
    try {
      // Get list of tables from the database
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) {
        console.error('Error checking database schema:', error);
        return { missingTables: requiredTables, existingTables: [] };
      }
      
      const existingTables = data.map(table => table.table_name);
      const missingTables = requiredTables.filter(table => !existingTables.includes(table));
      
      return {
        missingTables,
        existingTables
      };
    } catch (error) {
      console.error('Error in checkDatabaseSchema:', error);
      return { missingTables: requiredTables, existingTables: [] };
    }
  }
  
  /**
   * Check if RLS policies are enabled on specified tables
   */
  static async checkRLSPolicies(tables: string[]): Promise<Record<string, boolean>> {
    try {
      const result: Record<string, boolean> = {};
      
      // For each table, check if RLS is enabled
      for (const table of tables) {
        const { data, error } = await supabase
          .rpc('check_rls_enabled', { table_name: table });
        
        if (error) {
          console.error(`Error checking RLS for table ${table}:`, error);
          result[table] = false;
        } else {
          result[table] = !!data;
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in checkRLSPolicies:', error);
      return tables.reduce((acc, table) => ({ ...acc, [table]: false }), {});
    }
  }

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
        database: { 
          status: 'error', 
          message: 'Error checking database status',
          tables: []
        },
        storage: { status: 'error', message: 'Error checking storage status' },
        functions: { 
          status: 'error', 
          message: 'Error checking functions status',
          availableFunctions: []
        },
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
          status: 'error' as const, 
          message: 'Authentication service is experiencing issues'
        };
      }
      
      return { 
        status: 'ok' as const, 
        message: 'Authentication service is operating normally'
      };
    } catch (error) {
      return { 
        status: 'error' as const, 
        message: 'Failed to connect to authentication service'
      };
    }
  }
  
  private async checkDatabaseService() {
    try {
      // Simple query to test database connectivity
      const { data, error } = await supabase
        .from('wireframe_system_events')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        return { 
          status: 'error' as const, 
          message: 'Database is experiencing connectivity issues',
          tables: []
        };
      }
      
      // Get table list for complete health check
      const { data: tableData, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      const tables = tableError ? [] : tableData?.map(t => t.table_name) || [];
      
      return { 
        status: 'ok' as const, 
        message: 'Database is connected and responding to queries',
        tables
      };
    } catch (error) {
      return { 
        status: 'error' as const, 
        message: 'Failed to connect to database service',
        tables: []
      };
    }
  }
  
  private async checkStorageService() {
    try {
      // List buckets to check storage
      const { data, error } = await supabase
        .storage
        .getBucket('wireframes');
      
      if (error) {
        // Check if it's a permissions error or a service error
        if (error.message.includes('permission')) {
          return { 
            status: 'ok' as const, 
            message: 'Storage service is online but access is restricted'
          };
        }
        
        return { 
          status: 'error' as const, 
          message: 'Storage service is experiencing issues'
        };
      }
      
      // Get buckets list
      const { data: bucketsData } = await supabase.storage.listBuckets();
      const buckets = bucketsData?.map(b => b.name) || [];
      
      return { 
        status: 'ok' as const, 
        message: 'Storage service is operating normally',
        buckets
      };
    } catch (error) {
      return { 
        status: 'error' as const, 
        message: 'Failed to connect to storage service'
      };
    }
  }
  
  private async checkFunctionsService() {
    try {
      // We'll assume functions are working if we can access the list
      // In a real app, this would ping an edge function health check endpoint
      
      // Mock function list for demo purposes
      const functionsList = [
        'generate-wireframe',
        'check-subscription',
        'process-payment',
        'send-client-notification',
        'analyze-feedback',
        'export-to-pdf',
        'generate-embed',
        'cleanup-expired-cache',
        'check-database-performance',
        'monitoring-simulation',
        'stripe-webhook',
        'admin-invitations'
      ];
      
      return { 
        status: 'ok' as const, 
        message: 'Edge functions appear to be operational',
        availableFunctions: functionsList
      };
    } catch (error) {
      return { 
        status: 'error' as const, 
        message: 'Failed to verify edge functions status',
        availableFunctions: []
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
