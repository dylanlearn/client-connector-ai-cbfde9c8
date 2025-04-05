
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenanceResult } from "./types";
import { recordTableVacuumed } from "./maintenance-tracker";
import { refreshDatabaseStatistics } from "./statistics-service";

/**
 * Auto vacuum recommendation threshold (20% dead rows)
 * Tables with dead rows above this percentage will trigger recommendations
 */
export const AUTO_VACUUM_THRESHOLD = 20;

/**
 * Minimum time between maintenance recommendations (6 hours)
 * This prevents spam notifications for the same tables
 */
export const MIN_RECOMMENDATION_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

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

/**
 * Automatically vacuum tables that need maintenance
 */
export async function vacuumRecommendedTables(tableNames: string[]): Promise<void> {
  if (!tableNames.length) return;
  
  toast.loading(`Cleaning ${tableNames.length} tables with high dead rows...`);
  
  try {
    // Call database-maintenance edge function to vacuum all tables in one go
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { 
        action: 'vacuum', 
        tables: tableNames 
      }
    });
    
    if (error) {
      console.error("Error vacuuming recommended tables:", error);
      toast.error("Failed to clean tables", {
        description: error.message
      });
      return;
    }
    
    const successCount = data?.success_tables?.length || 0;
    const failCount = data?.failed_tables?.length || 0;
    
    if (successCount > 0) {
      // Record each successfully vacuumed table
      if (data?.success_tables) {
        data.success_tables.forEach((tableName: string) => {
          recordTableVacuumed(tableName);
        });
      }
      
      // Show success message
      toast.success(`Database cleanup complete`, {
        description: `Successfully cleaned ${successCount} tables${failCount ? `, ${failCount} failed` : ''}`
      });
      
      // Refresh database statistics to show updated dead row counts
      await refreshDatabaseStatistics(false);
    } else {
      toast.error("Database cleanup failed", {
        description: "No tables were successfully cleaned"
      });
    }
  } catch (error) {
    console.error("Error during automatic vacuum:", error);
    toast.error("Database cleanup failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
