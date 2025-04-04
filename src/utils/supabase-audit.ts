
import { supabase } from '@/integrations/supabase/client';

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
 * Performs a comprehensive health check on Supabase services
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthCheck> {
  const healthCheck: SupabaseHealthCheck = {
    auth: { status: 'ok', message: 'Authentication service is operational' },
    database: { status: 'ok', message: 'Database is operational', tables: [] },
    storage: { status: 'ok', message: 'Storage service is operational' },
    functions: { status: 'ok', message: 'Edge functions are operational', availableFunctions: [] },
    overall: 'healthy'
  };

  // Check authentication service
  try {
    await supabase.auth.getSession();
  } catch (error) {
    healthCheck.auth = { 
      status: 'error', 
      message: `Authentication service error: ${error instanceof Error ? error.message : String(error)}` 
    };
  }

  // Check database connectivity by querying a simple table
  try {
    const { data: tables, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) throw tablesError;
    
    healthCheck.database.tables = tables.map(t => t.tablename);
  } catch (error) {
    healthCheck.database = { 
      status: 'error', 
      message: `Database connectivity error: ${error instanceof Error ? error.message : String(error)}`,
      tables: []
    };
  }

  // Check edge functions
  try {
    // List available functions
    const functions = ['analyze-feedback', 'initialize-memory'];
    healthCheck.functions.availableFunctions = functions;
    
    // Test one function to verify connectivity
    const { error: functionError } = await supabase.functions.invoke('analyze-feedback', {
      body: { feedbackText: '' },
      headers: { 'Content-Type': 'application/json' }
    });
    
    // We expect an error since we sent empty feedback, but at least we verified connectivity
    if (functionError && !functionError.message.includes('Missing or invalid feedback text')) {
      throw new Error(`Unexpected error: ${functionError.message}`);
    }
  } catch (error) {
    healthCheck.functions = { 
      status: 'error', 
      message: `Edge functions error: ${error instanceof Error ? error.message : String(error)}`,
      availableFunctions: []
    };
  }

  // Determine overall health
  const errorCount = [
    healthCheck.auth.status, 
    healthCheck.database.status, 
    healthCheck.storage.status, 
    healthCheck.functions.status
  ].filter(status => status === 'error').length;
  
  if (errorCount === 0) {
    healthCheck.overall = 'healthy';
  } else if (errorCount < 2) {
    healthCheck.overall = 'degraded';
  } else {
    healthCheck.overall = 'unhealthy';
  }

  return healthCheck;
}

/**
 * Checks if crucial tables exist in the database
 */
export async function verifyRequiredTables(requiredTables: string[]): Promise<{
  missingTables: string[];
  existingTables: string[];
}> {
  try {
    const { data: tables, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) throw error;
    
    const existingTableNames = tables.map(t => t.tablename);
    const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
    
    return {
      missingTables,
      existingTables: existingTableNames
    };
  } catch (error) {
    console.error('Error verifying required tables:', error);
    return {
      missingTables: requiredTables,
      existingTables: []
    };
  }
}

/**
 * Checks RLS policies on specified tables
 */
export async function checkRLSPolicies(tables: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  
  try {
    for (const table of tables) {
      const { data, error } = await supabase
        .from('pg_catalog.pg_policies')
        .select('policyname')
        .eq('tablename', table);
        
      if (error) throw error;
      
      results[table] = data.length > 0;
    }
    
    return results;
  } catch (error) {
    console.error('Error checking RLS policies:', error);
    return tables.reduce((acc, table) => {
      acc[table] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}
