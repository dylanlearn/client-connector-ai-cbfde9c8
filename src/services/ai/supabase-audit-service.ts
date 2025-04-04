
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Type definitions for SupabaseAuditService
 */
export interface SupabaseHealthCheck {
  auth: {
    status: 'ok' | 'error';
    message: string;
  };
  database: {
    status: 'ok' | 'error';
    message: string;
    tables: string[];
  };
  storage: {
    status: 'ok' | 'error';
    message: string;
  };
  functions: {
    status: 'ok' | 'error';
    message: string;
    availableFunctions: string[];
  };
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

/**
 * Service for auditing and monitoring Supabase resources
 */
export const SupabaseAuditService = {
  /**
   * Run a comprehensive health check on all Supabase services
   */
  runFullHealthCheck: async (): Promise<SupabaseHealthCheck> => {
    try {
      const [authStatus, dbStatus, storageStatus, functionsStatus] = await Promise.all([
        SupabaseAuditService.checkAuthStatus(),
        SupabaseAuditService.checkDatabaseStatus(),
        SupabaseAuditService.checkStorageStatus(),
        SupabaseAuditService.checkEdgeFunctionsStatus()
      ]);
      
      let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (
        authStatus.status === 'error' || 
        dbStatus.status === 'error' || 
        storageStatus.status === 'error' || 
        functionsStatus.status === 'error'
      ) {
        overall = 'unhealthy';
      } else if (
        authStatus.status === 'ok' && 
        dbStatus.status === 'ok' && 
        storageStatus.status === 'ok' && 
        functionsStatus.status === 'ok' 
      ) {
        overall = 'healthy';
      } else {
        overall = 'degraded';
      }
      
      return {
        auth: authStatus,
        database: dbStatus,
        storage: storageStatus,
        functions: functionsStatus,
        overall
      };
    } catch (error) {
      console.error('Error running full health check:', error);
      return {
        auth: { status: 'error', message: 'Unable to check auth status' },
        database: { status: 'error', message: 'Unable to check database status', tables: [] },
        storage: { status: 'error', message: 'Unable to check storage status' },
        functions: { status: 'error', message: 'Unable to check functions status', availableFunctions: [] },
        overall: 'unhealthy'
      };
    }
  },
  
  /**
   * Check authentication service status
   */
  checkAuthStatus: async (): Promise<{ status: 'ok' | 'error'; message: string }> => {
    try {
      // Try to access a public table or function that doesn't require auth
      const { error } = await supabase
        .from('ai_wireframes')
        .select('count')
        .limit(1)
        .maybeSingle();
      
      if (error && error.message.includes('authentication')) {
        return { status: 'error', message: 'Authentication service issues: ' + error.message };
      }
      
      return { status: 'ok', message: 'Authentication service is running properly' };
    } catch (error) {
      return {
        status: 'error',
        message: `Error checking auth status: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  },
  
  /**
   * Check database service status
   */
  checkDatabaseStatus: async (): Promise<{ status: 'ok' | 'error'; message: string; tables: string[] }> => {
    try {
      // Use RPC with type safety to fetch table information
      // Cast to any to avoid TypeScript errors with dynamic RPC calls
      const { data, error } = await (supabase.rpc('get_all_tables' as any) as any);
      
      if (error) {
        return {
          status: 'error',
          message: `Database error: ${error.message}`,
          tables: []
        };
      }
      
      const tables = Array.isArray(data) 
        ? data.map((table: any) => table.table_name as string)
        : [];
      
      return {
        status: 'ok',
        message: `Database is running with ${tables.length} tables`,
        tables
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error checking database status: ${error instanceof Error ? error.message : String(error)}`,
        tables: []
      };
    }
  },
  
  /**
   * Check storage service status
   */
  checkStorageStatus: async (): Promise<{ status: 'ok' | 'error'; message: string }> => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        return {
          status: 'error',
          message: `Storage error: ${error.message}`
        };
      }
      
      return {
        status: 'ok',
        message: `Storage service is running with ${data.length} buckets`
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error checking storage status: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  },
  
  /**
   * Check edge functions service status
   */
  checkEdgeFunctionsStatus: async (): Promise<{ status: 'ok' | 'error'; message: string; availableFunctions: string[] }> => {
    try {
      // Use RPC with type safety to fetch function information
      // Cast to any to avoid TypeScript errors with dynamic RPC calls
      const { data, error } = await (supabase.rpc('list_functions' as any) as any);
      
      if (error) {
        return {
          status: 'error',
          message: `Edge functions error: ${error.message}`,
          availableFunctions: []
        };
      }
      
      const functions = Array.isArray(data) 
        ? data.map((fn: any) => fn.function_name as string)
        : [];
      
      return {
        status: 'ok',
        message: `Edge functions service is running with ${functions.length} functions`,
        availableFunctions: functions
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error checking edge functions status: ${error instanceof Error ? error.message : String(error)}`,
        availableFunctions: []
      };
    }
  },
  
  /**
   * Check if required tables exist in the database
   */
  checkDatabaseSchema: async (requiredTables: string[]): Promise<{
    missingTables: string[];
    existingTables: string[];
  }> => {
    try {
      // Use RPC with type safety to fetch table information
      // Cast to any to avoid TypeScript errors with dynamic RPC calls
      const { data, error } = await (supabase.rpc('get_table_info' as any) as any);
      
      if (error) {
        throw new Error(`Error checking database schema: ${error.message}`);
      }
      
      const allTables: string[] = Array.isArray(data) 
        ? data.map((table: any) => table.table_name as string)
        : [];
      
      const missingTables = requiredTables.filter(table => !allTables.includes(table));
      const existingTables = requiredTables.filter(table => allTables.includes(table));
      
      return {
        missingTables,
        existingTables
      };
    } catch (error) {
      console.error('Error checking database schema:', error);
      return {
        missingTables: requiredTables,
        existingTables: []
      };
    }
  },
  
  /**
   * Check RLS policies on specified tables
   */
  checkRLSPolicies: async (tables: string[]): Promise<Record<string, boolean>> => {
    try {
      // Use RPC with type safety to fetch RLS policy information
      // Cast to any to avoid TypeScript errors with dynamic RPC calls
      const { data, error } = await (supabase.rpc('get_table_rls' as any) as any);
      
      if (error) {
        throw new Error(`Error checking RLS policies: ${error.message}`);
      }
      
      const rlsPolicies: Record<string, boolean> = {};
      
      if (Array.isArray(data)) {
        // Process the data to determine which tables have RLS enabled
        data.forEach((table: any) => {
          const tableName = table.table_name as string;
          const hasRls = table.has_rls as boolean;
          
          if (tables.includes(tableName)) {
            rlsPolicies[tableName] = hasRls;
          }
        });
      }
      
      // Set default value for tables that weren't found
      tables.forEach(table => {
        if (rlsPolicies[table] === undefined) {
          rlsPolicies[table] = false;
        }
      });
      
      return rlsPolicies;
    } catch (error) {
      console.error('Error checking RLS policies:', error);
      
      // Return all tables as not having RLS in case of error
      return tables.reduce((acc, table) => {
        acc[table] = false;
        return acc;
      }, {} as Record<string, boolean>);
    }
  }
};
