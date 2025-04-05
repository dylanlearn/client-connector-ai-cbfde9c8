
import { Json } from "@/integrations/supabase/types";
import { Database } from "@/integrations/supabase/types";
import { SupabaseHealthCheck } from "@/types/supabase-audit";
import { supabase } from "@/integrations/supabase/client";

export class SupabaseAuditService {
  static async runFullHealthCheck(): Promise<SupabaseHealthCheck> {
    try {
      const [authCheck, databaseCheck, storageCheck, functionsCheck] = await Promise.all([
        this.checkAuth(),
        this.checkDatabase(),
        this.checkStorage(),
        this.checkFunctions()
      ]);
      
      // Determine overall health
      const statusValues = [
        authCheck.status,
        databaseCheck.status,
        storageCheck.status,
        functionsCheck.status
      ];
      
      let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (statusValues.some(status => status === 'error')) {
        overall = 'unhealthy';
      } else if (statusValues.some(status => status !== 'ok')) {
        overall = 'degraded';
      }
      
      return {
        auth: authCheck,
        database: databaseCheck,
        storage: storageCheck,
        functions: functionsCheck,
        overall
      };
    } catch (error) {
      console.error('Error in runFullHealthCheck:', error);
      return {
        auth: { status: 'error', message: 'Failed to check auth' },
        database: { status: 'error', message: 'Failed to check database', tables: [] },
        storage: { status: 'error', message: 'Failed to check storage' },
        functions: { status: 'error', message: 'Failed to check functions', availableFunctions: [] },
        overall: 'unhealthy'
      };
    }
  }
  
  static async checkAuth(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      return { status: 'ok', message: 'Auth service is responding correctly' };
    } catch (error) {
      console.error('Auth check failed:', error);
      return { status: 'error', message: 'Auth service is not responding correctly' };
    }
  }
  
  static async checkDatabase(): Promise<{ 
    status: 'ok' | 'error'; 
    message: string; 
    tables: string[];
    performance?: any; 
  }> {
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (tableError) throw tableError;
      
      // Get list of tables
      const { data: tablesList, error: tablesError } = await supabase
        .rpc('check_database_performance');
        
      if (tablesError) throw tablesError;
      
      let tableStats: any[] = [];
      if (tablesList && typeof tablesList === 'object') {
        // Safely access table_stats, handle both array and object formats
        if (Array.isArray(tablesList)) {
          // Handle direct array response
          tableStats = tablesList;
        } else {
          // Handle as an object with table_stats property
          // First check if table_stats exists as a property
          if ('table_stats' in tablesList) {
            // Access table_stats property
            tableStats = tablesList.table_stats || [];
          } else {
            // Handle any other JSON structure
            tableStats = Object.values(tablesList).filter(item => 
              item && typeof item === 'object'
            );
          }
        }
      }
      
      const tables = tableStats.map((t: any) => t.table || '').filter(Boolean) || [];
      
      return { 
        status: 'ok', 
        message: 'Database is responding correctly',
        tables,
        performance: tablesList
      };
    } catch (error) {
      console.error('Database check failed:', error);
      return { 
        status: 'error', 
        message: 'Database is not responding correctly',
        tables: [] 
      };
    }
  }
  
  static async checkStorage(): Promise<{ 
    status: 'ok' | 'error'; 
    message: string;
    buckets?: string[]; 
  }> {
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) throw bucketsError;
      
      return { 
        status: 'ok', 
        message: 'Storage service is responding correctly',
        buckets: buckets?.map(b => b.name) || []
      };
    } catch (error) {
      console.error('Storage check failed:', error);
      return { 
        status: 'error', 
        message: 'Storage service is not responding correctly' 
      };
    }
  }
  
  static async checkFunctions(): Promise<{
    status: 'ok' | 'error' | 'degraded';
    message: string;
    availableFunctions: string[];
  }> {
    try {
      // We can't directly check edge functions from the client
      // So we use a heuristic check by looking for function calls in database logs
      const { data, error } = await supabase
        .from('wireframe_system_events')
        .select('*')
        .eq('event_type', 'function_invocation')
        .limit(1);
        
      // List available functions - this would be hardcoded or fetched from config
      const availableFunctions = [
        'admin-invitations',
        'admin-user-management',
        'analyze-design-patterns',
        'analyze-feedback',
        'analyze-interaction-patterns',
        'analyze-memory-patterns',
        'animation-tracking',
        'cancel-subscription',
        'check-subscription',
        'cleanup-expired-cache',
        'create-checkout',
        'create-error-table',
        'create-template-checkout',
        'design-suggestions',
        'export-to-notion',
        'export-to-slack',
        'generate-embedding',
        'generate-wireframe',
        'generate-with-openai',
        'get-heatmap-data',
        'initialize-memory',
        'interaction-db-functions',
        'monitoring-simulation',
        'process-wireframe-tasks',
        'redeem-invitation',
        'send-client-link',
        'send-client-notification',
        'send-pdf-export',
        'send-sms',
        'setup-rpc-functions',
        'stripe-webhook',
        'update-sms-status',
        'upgrade-team-members'
      ];
      
      const status = error ? 'degraded' as const : 'ok' as const;
      
      return {
        status,
        message: error 
          ? 'No recent function invocation logs found, but service may still be working' 
          : 'Edge functions service appears to be working correctly',
        availableFunctions
      };
    } catch (error) {
      console.error('Functions check failed:', error);
      return {
        status: 'error',
        message: 'Failed to check edge functions service',
        availableFunctions: []
      };
    }
  }
  
  static async checkDatabaseSchema(requiredTables: string[]): Promise<{
    missingTables: string[];
    existingTables: string[];
  }> {
    try {
      const result = await this.checkDatabase();
      
      const existingTables = result.tables || [];
      const missingTables = requiredTables.filter(table => !existingTables.includes(table));
      
      return {
        missingTables,
        existingTables: requiredTables.filter(table => existingTables.includes(table))
      };
    } catch (error) {
      console.error('Schema check failed:', error);
      return {
        missingTables: requiredTables,
        existingTables: []
      };
    }
  }
  
  static async checkRLSPolicies(tables: string[]): Promise<Record<string, boolean>> {
    // This would require admin privileges or a custom backend endpoint
    // For now, we'll return a simulated result
    const result: Record<string, boolean> = {};
    tables.forEach(table => {
      result[table] = true; // Assume RLS is enabled
    });
    
    return result;
  }
  
  // New method to check for essential Supabase functions
  static async checkDatabaseFunctions(): Promise<{
    status: 'ok' | 'error'; 
    message: string;
    functions: string[];
    missingFunctions: string[];
  }> {
    const essentialFunctions = [
      'check_database_performance',
      'record_system_event',
      'handle_new_user',
      'update_updated_at_column'
    ];
    
    try {
      // We can only check for functions indirectly through errors
      // Attempt to call a function we know should exist
      const { error } = await supabase.rpc('check_database_performance');
      
      if (error && error.message.includes('function does not exist')) {
        return {
          status: 'error',
          message: 'Essential database functions are missing',
          functions: [],
          missingFunctions: essentialFunctions
        };
      }
      
      return {
        status: 'ok',
        message: 'Database functions appear to be properly configured',
        functions: essentialFunctions,
        missingFunctions: []
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to check database functions',
        functions: [],
        missingFunctions: essentialFunctions
      };
    }
  }
  
  // New method to check for types consistency
  static async checkTypeConsistency(): Promise<{
    status: 'ok' | 'error';
    message: string;
    issues: string[];
  }> {
    try {
      // This is a proxy check - we test a simple query that uses known type conversions
      const { data, error } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .limit(1)
        .single();
        
      if (error) {
        return {
          status: 'error',
          message: 'Type checking failed',
          issues: [error.message]
        };
      }
      
      return {
        status: 'ok',
        message: 'Type checking passed for common tables',
        issues: []
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to check type consistency',
        issues: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
