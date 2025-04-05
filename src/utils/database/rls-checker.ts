
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the given table has RLS enabled
 */
export async function checkRLSEnabled(tableName: string): Promise<boolean> {
  try {
    // This query checks if RLS is enabled for a specific table
    const { data, error } = await supabase.rpc('check_table_rls', {
      table_name: tableName
    });
    
    if (error) {
      console.error(`Error checking RLS for table ${tableName}:`, error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error(`Error checking RLS for table ${tableName}:`, error);
    return false;
  }
}

/**
 * Get policies for a specific table
 */
export async function getTablePolicies(tableName: string): Promise<any[]> {
  try {
    // This query retrieves all policies for a specific table
    const { data, error } = await supabase.rpc('get_table_policies', {
      table_name: tableName
    });
    
    if (error) {
      console.error(`Error getting policies for table ${tableName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error getting policies for table ${tableName}:`, error);
    return [];
  }
}
