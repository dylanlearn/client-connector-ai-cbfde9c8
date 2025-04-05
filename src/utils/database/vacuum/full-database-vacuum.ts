
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenanceResult } from "../types";
import { recordTableVacuumed } from "../maintenance-tracker";
import { refreshDatabaseStatistics } from "../statistics-service";

/**
 * Run full database cleanup (vacuum all tables)
 */
export async function cleanupFullDatabase(): Promise<MaintenanceResult> {
  try {
    // Get the list of all tables first
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (tablesError) {
      console.error('Error fetching tables list:', tablesError);
      throw tablesError;
    }
    
    if (!tablesData || tablesData.length === 0) {
      return {
        success: false,
        message: 'No tables found in public schema'
      };
    }
    
    const allTables = tablesData.map(t => t.tablename);
    console.log(`Running VACUUM on all ${allTables.length} tables:`, allTables);
    
    toast.loading(`Cleaning all ${allTables.length} database tables...`);
    
    // Call the database-maintenance function to vacuum all tables
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { 
        action: 'vacuum', 
        tables: allTables 
      }
    });

    if (error) {
      console.error('Error running full database cleanup:', error);
      toast.error("Database cleanup failed", {
        description: error.message
      });
      throw error;
    }

    const successCount = data?.success_tables?.length || 0;
    const failCount = data?.failed_tables?.length || 0;
    
    // Record successfully vacuumed tables
    if (data?.success_tables) {
      data.success_tables.forEach((tableName: string) => {
        recordTableVacuumed(tableName);
      });
    }
    
    // Refresh database statistics after cleanup
    await refreshDatabaseStatistics(false);
    
    toast.success(`Database cleanup complete`, {
      description: `Successfully cleaned ${successCount} tables${failCount ? `, ${failCount} failed` : ''}`
    });
    
    return {
      success: successCount > 0,
      message: `VACUUM completed on ${successCount} tables, ${failCount} failed`,
      details: data
    };
  } catch (error) {
    console.error('Error running full database cleanup:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
