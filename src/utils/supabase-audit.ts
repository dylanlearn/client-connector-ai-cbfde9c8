
import { Json } from "@/integrations/supabase/types";
import { Database } from "@/integrations/supabase/types";
import { SupabaseAuditService } from "@/services/ai/supabase-audit-service";
import { SupabaseHealthCheck } from "@/types/supabase-audit";

/**
 * Performs a comprehensive health check on Supabase services
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthCheck> {
  return await SupabaseAuditService.runFullHealthCheck();
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
