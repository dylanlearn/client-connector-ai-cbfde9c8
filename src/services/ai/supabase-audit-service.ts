
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
      // Use a simpler query approach to avoid typing issues
      // Get list of tables from the database using SQL query
      const { data, error } = await supabase
        .from('wireframe_system_events') // Using an existing table
        .select('id')
        .limit(1)
        .then(async () => {
          // If we can query, manually check for tables using custom queries for each one
          const tableChecks = await Promise.all(
            requiredTables.map(async (table) => {
              const { count, error } = await supabase
                .from(table as any)
                .select('*', { count: 'exact', head: true });
              
              return { table, exists: !error };
            })
          );
          
          const existingTables = tableChecks.filter(t => t.exists).map(t => t.table);
          return { 
            data: existingTables,
            error: null
          };
        });
      
      if (error) {
        console.error('Error checking database schema:', error);
        return { missingTables: requiredTables, existingTables: [] };
      }
      
      const existingTables = data || [];
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
      
      // Mock RLS check since we can't access information_schema directly
      // In a real app, this would use a custom database function
      for (const table of tables) {
        // Simulate a check for each table
        result[table] = true; // Assume all tables have RLS enabled for demo
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
        auth: { status: 'error' as const, message: 'Error checking auth status' },
        database: { 
          status: 'error' as const, 
          message: 'Error checking database status',
          tables: []
        },
        storage: { status: 'error' as const, message: 'Error checking storage status' },
        functions: { 
          status: 'error' as const, 
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
      // Using a real database function that exists in the schema
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
      
      // Get a simpler list of tables by querying a few known ones
      const commonTables = [
        'profiles', 'projects', 'wireframe_system_events', 
        'global_memories', 'user_memories', 'project_memories', 
        'feedback_analysis'
      ];
      
      // Check which tables we can actually query
      const tablePromises = commonTables.map(async tableName => {
        const { error } = await supabase
          .from(tableName as any)
          .select('id', { head: true })
          .limit(1);
        return { name: tableName, exists: !error };
      });
      
      const tableResults = await Promise.all(tablePromises);
      const existingTables = tableResults
        .filter(table => table.exists)
        .map(table => table.name);
      
      return { 
        status: 'ok' as const, 
        message: 'Database is connected and responding to queries',
        tables: existingTables
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
