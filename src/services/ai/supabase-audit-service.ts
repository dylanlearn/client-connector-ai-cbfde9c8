
import { supabase } from "@/integrations/supabase/client";
import { SupabaseHealthCheck, SupabaseTable } from "@/types/supabase-audit";

/**
 * Service for auditing and monitoring Supabase resources
 */
export const SupabaseAuditService = {
  /**
   * Run a full health check of all Supabase services
   */
  runFullHealthCheck: async (): Promise<SupabaseHealthCheck> => {
    try {
      // Check Auth Service
      const authCheck = await SupabaseAuditService.checkAuthService();
      
      // Check Database Service
      const dbCheck = await SupabaseAuditService.checkDatabaseService();
      
      // Check Storage Service
      const storageCheck = await SupabaseAuditService.checkStorageService();
      
      // Check Functions Service
      const functionsCheck = await SupabaseAuditService.checkFunctionsService();
      
      // Determine overall health
      let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (
        authCheck.status === 'error' ||
        dbCheck.status === 'error' ||
        storageCheck.status === 'error' ||
        functionsCheck.status === 'error'
      ) {
        overall = 'unhealthy';
      } else if (
        authCheck.status === 'degraded' ||
        dbCheck.status === 'degraded' ||
        storageCheck.status === 'degraded' ||
        functionsCheck.status === 'degraded'
      ) {
        overall = 'degraded';
      }
      
      return {
        overall,
        auth: authCheck,
        database: dbCheck,
        storage: storageCheck,
        functions: functionsCheck
      };
    } catch (error) {
      console.error("Error running full health check:", error);
      return {
        overall: 'unhealthy',
        auth: { status: 'error', message: 'Failed to check auth service' },
        database: { status: 'error', message: 'Failed to check database service' },
        storage: { status: 'error', message: 'Failed to check storage service' },
        functions: { status: 'error', message: 'Failed to check functions service' }
      };
    }
  },
  
  /**
   * Check if required database tables exist
   */
  checkDatabaseSchema: async (requiredTables: string[]) => {
    try {
      // Get list of tables from Supabase
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
        
      if (error) {
        console.error("Error checking database schema:", error);
        return { 
          missingTables: requiredTables,
          existingTables: []
        };
      }
      
      const existingTables = data ? data.map(row => row.tablename) : [];
      
      // Find missing tables
      const missingTables = requiredTables.filter(table => {
        return !existingTables.includes(table);
      });
      
      return {
        missingTables,
        existingTables
      };
    } catch (error) {
      console.error("Error checking database schema:", error);
      return { 
        missingTables: requiredTables,
        existingTables: []
      };
    }
  },
  
  /**
   * Check RLS policies for the given tables
   */
  checkRLSPolicies: async (tables: string[]) => {
    try {
      const { data, error } = await supabase
        .rpc('check_rls_policies', { table_names: tables });
        
      if (error) {
        console.error("Error checking RLS policies:", error);
        return {};
      }
      
      return data || {};
    } catch (error) {
      console.error("Error checking RLS policies:", error);
      return {};
    }
  },
  
  /**
   * Check Auth Service health
   */
  checkAuthService: async () => {
    try {
      // Check if we can access the auth API
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          status: 'error',
          message: `Auth service error: ${error.message}`
        };
      }
      
      return {
        status: 'ok',
        message: 'Auth service is operational'
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Auth service error: ${error.message}`
      };
    }
  },
  
  /**
   * Check Database Service health
   */
  checkDatabaseService: async () => {
    try {
      // Simple query to test database connectivity
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        return {
          status: 'error',
          message: `Database service error: ${error.message}`
        };
      }
      
      const elapsed = Date.now() - startTime;
      let status = 'ok';
      let message = 'Database service is operational';
      
      // If query took too long, mark as degraded
      if (elapsed > 1000) {
        status = 'degraded';
        message = `Database service is slow (${elapsed}ms response time)`;
      }
      
      return {
        status,
        message,
        performance: { queryTime: elapsed }
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Database service error: ${error.message}`
      };
    }
  },
  
  /**
   * Check Storage Service health
   */
  checkStorageService: async () => {
    try {
      // List buckets to test storage connectivity
      const { data, error } = await supabase
        .storage
        .listBuckets();
      
      if (error) {
        return {
          status: 'error',
          message: `Storage service error: ${error.message}`
        };
      }
      
      return {
        status: 'ok',
        message: `Storage service is operational, ${data.length} buckets available`
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Storage service error: ${error.message}`
      };
    }
  },
  
  /**
   * Check Functions Service health
   */
  checkFunctionsService: async () => {
    try {
      // Try to invoke a simple function
      const { data, error } = await supabase.functions.invoke("analyze-feedback", {
        body: { 
          feedbackText: "This is a test message to check if the functions service is working." 
        }
      });
      
      if (error) {
        return {
          status: 'error',
          message: `Functions service error: ${error.message}`
        };
      }
      
      // Get list of functions
      const availableFunctions = [
        "analyze-feedback", 
        "analyze-memory-patterns", 
        "generate-design-image"
      ];
      
      return {
        status: 'ok',
        message: `Functions service is operational`,
        availableFunctions
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Functions service error: ${error.message}`,
        availableFunctions: []
      };
    }
  },
  
  /**
   * Get database tables information
   */
  getTableInfo: async (): Promise<SupabaseTable[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_table_stats');
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error getting table info:", error);
      return [];
    }
  }
};
