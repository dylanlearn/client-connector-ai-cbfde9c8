
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
 * Minimum time between maintenance recommendations (10 minutes)
 * This prevents spam notifications for the same tables
 */
export const MIN_RECOMMENDATION_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

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
  if (!tableNames || !tableNames.length) {
    console.log("No tables provided for vacuum");
    toast.error("No tables to clean", {
      description: "No tables were provided for cleaning"
    });
    return;
  }
  
  console.log(`Attempting to clean ${tableNames.length} tables:`, tableNames);
  toast.loading(`Cleaning ${tableNames.length} tables with high dead rows...`);
  
  try {
    // Validate that tables exist before attempting vacuum
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .in('tablename', tableNames);
    
    if (tablesError) {
      console.error("Error verifying tables existence:", tablesError);
      toast.error("Failed to verify tables", {
        description: tablesError.message
      });
      return;
    }
    
    if (!tablesData || tablesData.length === 0) {
      console.error("No matching tables found in public schema:", tableNames);
      toast.error("Tables not found", {
        description: "The specified tables do not exist in the database"
      });
      return;
    }
    
    // Get the list of valid table names
    const validTableNames = tablesData.map(t => t.tablename);
    console.log("Valid tables found:", validTableNames);
    
    if (validTableNames.length === 0) {
      toast.error("No valid tables to clean", {
        description: "None of the specified tables were found in the database"
      });
      return;
    }
    
    // Proceed with vacuum operation using only validated table names
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { 
        action: 'vacuum', 
        tables: validTableNames
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
        description: data?.failed_tables?.length > 0 
          ? `Failed tables: ${data.failed_tables.map((ft: any) => ft.table).join(', ')}` 
          : "No tables were successfully cleaned"
      });
    }
  } catch (error) {
    console.error("Error during automatic vacuum:", error);
    toast.error("Database cleanup failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
