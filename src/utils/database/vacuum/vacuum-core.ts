
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenanceResult } from "../types";
import { recordTableVacuumed } from "../maintenance-tracker";
import { refreshDatabaseStatistics } from "../statistics-service";

/**
 * Run vacuum on a specific table
 */
export async function vacuumTable(tableName: string): Promise<MaintenanceResult> {
  try {
    console.log(`Running VACUUM on table: ${tableName}`);
    
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { action: 'vacuum', tables: [tableName] }
    });

    if (error) {
      console.error('Error vacuuming table:', error);
      throw error;
    }

    if (data?.failed_tables && data.failed_tables.length > 0) {
      throw new Error(`Failed to vacuum table ${tableName}: ${data.failed_tables[0]?.error || 'Unknown error'}`);
    }

    if (data?.success_tables && data.success_tables.includes(tableName)) {
      // Record successful vacuum
      recordTableVacuumed(tableName);
      
      // Refresh database statistics after vacuum
      await refreshDatabaseStatistics(false);
      
      return {
        success: true,
        message: `VACUUM completed successfully on table: ${tableName}`,
        details: data
      };
    } else {
      throw new Error(`VACUUM operation didn't report success for table ${tableName}`);
    }
  } catch (error) {
    console.error('Error vacuuming table:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
