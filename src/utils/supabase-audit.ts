import { Json } from "@/integrations/supabase/types";
import { Database } from "@/integrations/supabase/types";
import { SupabaseAuditService } from "@/services/ai/supabase-audit-service";

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
  const { auth, database, storage, functions, overall } = await SupabaseAuditService.runFullHealthCheck();
  
  return {
    auth,
    database,
    storage,
    functions,
    overall
  };
}

/**
 * Checks if crucial tables exist in the database
 */
export async function verifyRequiredTables(requiredTables: string[]): Promise<{
  missingTables: string[];
  existingTables: string[];
}> {
  return await SupabaseAuditService.checkDatabaseSchema(requiredTables);
}

/**
 * Checks RLS policies on specified tables based on application knowledge
 */
export async function checkRLSPolicies(tables: string[]): Promise<Record<string, boolean>> {
  return await SupabaseAuditService.checkRLSPolicies(tables);
}
