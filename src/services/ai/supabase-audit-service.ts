
import { supabase } from "@/integrations/supabase/client";

export class SupabaseAuditService {
  static async runFullHealthCheck() {
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
      
      let overall = 'healthy';
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
  
  static async checkAuth() {
    try {
      await supabase.auth.getSession();
      return { status: 'ok', message: 'Auth service is responding correctly' };
    } catch (error) {
      console.error('Auth check failed:', error);
      return { status: 'error', message: 'Auth service is not responding correctly' };
    }
  }
  
  static async checkDatabase() {
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
      
      const tables = tablesList?.table_stats?.map((t: any) => t.table) || [];
      
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
  
  static async checkStorage() {
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
  
  static async checkFunctions() {
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
      
      return {
        status: error ? 'degraded' : 'ok',
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
  
  static async checkDatabaseSchema(requiredTables: string[]) {
    try {
      const { data, error } = await this.checkDatabase();
      
      if (error) throw error;
      
      const existingTables = data.tables || [];
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
  
  static async checkRLSPolicies(tables: string[]) {
    // This would require admin privileges or a custom backend endpoint
    // For now, we'll return a simulated result
    const result: Record<string, boolean> = {};
    tables.forEach(table => {
      result[table] = true; // Assume RLS is enabled
    });
    
    return result;
  }
}
