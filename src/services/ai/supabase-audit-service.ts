
import { supabase } from '@/integrations/supabase/client';
import { SupabaseHealthCheck } from '@/utils/supabase-audit';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Service for performing comprehensive Supabase audits
 */
export const supabaseAuditService = {
  /**
   * Run a full health check on all Supabase services
   */
  runFullHealthCheck: async (): Promise<{
    auth: { status: 'ok' | 'error'; message: string };
    database: { status: 'ok' | 'error'; message: string; tables: string[] };
    storage: { status: 'ok' | 'error'; message: string };
    functions: { status: 'ok' | 'error'; message: string; availableFunctions: string[] };
    overall: 'healthy' | 'degraded' | 'unhealthy';
  }> => {
    try {
      // Check authentication service
      const authStatus = await supabaseAuditService.checkAuthService();
      
      // Check database service
      const dbStatus = await supabaseAuditService.checkDatabaseService();
      
      // Check storage service
      const storageStatus = await supabaseAuditService.checkStorageService();
      
      // Check functions
      const functionsStatus = await supabaseAuditService.checkFunctionsService();
      
      // Determine overall health
      let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (
        authStatus.status === 'error' ||
        dbStatus.status === 'error' ||
        storageStatus.status === 'error' ||
        functionsStatus.status === 'error'
      ) {
        overall = 'unhealthy';
      } else if (
        authStatus.message.includes('warning') ||
        dbStatus.message.includes('warning') ||
        storageStatus.message.includes('warning') ||
        functionsStatus.message.includes('warning')
      ) {
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
      console.error('Error running Supabase health check:', error);
      return {
        auth: { status: 'error', message: 'Failed to check auth service' },
        database: { status: 'error', message: 'Failed to check database service', tables: [] },
        storage: { status: 'error', message: 'Failed to check storage service' },
        functions: { status: 'error', message: 'Failed to check functions service', availableFunctions: [] },
        overall: 'unhealthy'
      };
    }
  },
  
  /**
   * Check authentication service health
   */
  checkAuthService: async (): Promise<{ status: 'ok' | 'error'; message: string }> => {
    try {
      // Attempt to get settings to verify connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          status: 'error',
          message: `Auth service error: ${error.message}`
        };
      }
      
      return {
        status: 'ok',
        message: 'Auth service is working properly'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Auth service error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
  
  /**
   * Check database service health
   */
  checkDatabaseService: async (): Promise<{ status: 'ok' | 'error'; message: string; tables: string[] }> => {
    try {
      // Use a safer approach to get tables via an RPC function
      const { data, error } = await supabase.rpc('list_tables');
      
      if (error) {
        return {
          status: 'error',
          message: `Database service error: ${error.message}`,
          tables: []
        };
      }
      
      // Process the returned data safely
      let tableNames: string[] = [];
      if (data && Array.isArray(data)) {
        tableNames = data.filter(Boolean).map(item => String(item));
      }
      
      return {
        status: 'ok',
        message: `Database service is working properly with ${tableNames.length} tables`,
        tables: tableNames
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Database service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        tables: []
      };
    }
  },
  
  /**
   * Check storage service health
   */
  checkStorageService: async (): Promise<{ status: 'ok' | 'error'; message: string }> => {
    try {
      // List all buckets to check storage functionality
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        return {
          status: 'error',
          message: `Storage service error: ${error.message}`
        };
      }
      
      return {
        status: 'ok',
        message: `Storage service is working properly with ${buckets?.length || 0} buckets`
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Storage service error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
  
  /**
   * Check Functions service health
   */
  checkFunctionsService: async (): Promise<{ status: 'ok' | 'error'; message: string; availableFunctions: string[] }> => {
    try {
      // For Edge Functions, use a suitable method to check availability
      try {
        // Use a custom RPC to get function information instead
        const { data, error } = await supabase.rpc('get_function_list');
        
        if (error) {
          return {
            status: 'error',
            message: `Functions service error: ${error.message}`,
            availableFunctions: []
          };
        }
        
        // Process function names safely
        let functionNames: string[] = [];
        if (data && Array.isArray(data)) {
          functionNames = data.map(fn => (typeof fn === 'object' && fn ? fn.name || '' : '')).filter(Boolean);
        }
        
        return {
          status: 'ok',
          message: `Functions service is working properly with ${functionNames.length} functions available`,
          availableFunctions: functionNames
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'Functions service requires additional configuration',
          availableFunctions: []
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Functions service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        availableFunctions: []
      };
    }
  },
  
  /**
   * Check database schema against required tables
   */
  checkDatabaseSchema: async (requiredTables: string[]): Promise<{
    missingTables: string[];
    existingTables: string[];
  }> => {
    try {
      // Use the safer approach to get tables
      const { tables } = await supabaseAuditService.checkDatabaseService();
      
      const existingTables = requiredTables.filter(table => tables.includes(table));
      const missingTables = requiredTables.filter(table => !tables.includes(table));
      
      return {
        existingTables,
        missingTables
      };
    } catch (error) {
      console.error('Error checking database schema:', error);
      return {
        existingTables: [],
        missingTables: requiredTables
      };
    }
  },
  
  /**
   * Check Row Level Security (RLS) policies on specified tables
   */
  checkRLSPolicies: async (tables: string[]): Promise<Record<string, boolean>> => {
    try {
      const result: Record<string, boolean> = {};
      
      // For each table, check if RLS is enabled through an RPC call
      for (const table of tables) {
        try {
          const { data, error } = await supabase.rpc('check_rls_enabled', { 
            table_name: table 
          });
          
          if (error || data === null) {
            result[table] = false;
            continue;
          }
          
          result[table] = !!data;
        } catch (e) {
          result[table] = false;
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error checking RLS policies:', error);
      return {};
    }
  },
  
  /**
   * Check for expired cache entries and potentially clean them up
   */
  checkExpiredCacheEntries: async (): Promise<number> => {
    try {
      // Check for expired entries in ai_content_cache
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('ai_content_cache')
        .select('id')
        .lt('expires_at', now);
      
      if (error) {
        console.error('Error checking expired cache entries:', error);
        return 0;
      }
      
      return data?.length || 0;
    } catch (error) {
      console.error('Error checking expired cache entries:', error);
      return 0;
    }
  }
};
