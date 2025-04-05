
import { supabase } from "@/integrations/supabase/client";
import { recordTableVacuumed } from "../maintenance-tracker";
import { VacuumOptions, VacuumResult } from "./types";

/**
 * Vacuum a specific table to optimize its performance
 * 
 * @param tableName - Name of the table to vacuum
 * @param options - Vacuum options (full, analyze, freeze)
 */
export async function vacuumTable(
  tableName: string,
  options: VacuumOptions = {}
): Promise<VacuumResult> {
  try {
    console.log(`Vacuum service: Starting vacuum of table ${tableName}`, options);
    
    // Call the server-side vacuum function
    const { data, error } = await supabase.rpc('vacuum_table', {
      table_name: tableName,
      full: options.full || false,
      analyze: options.analyze || false
    });
    
    if (error) {
      console.error(`Vacuum failed for table ${tableName}:`, error);
      throw error;
    }
    
    // Update the maintenance state
    recordTableVacuumed(tableName);
    
    return {
      success: true,
      message: `Successfully vacuumed table ${tableName}`,
      details: data
    };
  } catch (error) {
    console.error('Error in vacuumTable:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : `Error vacuuming table ${tableName}`
    };
  }
}
