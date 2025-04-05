
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recordTableVacuumed } from "../maintenance-tracker";
import { refreshDatabaseStatistics } from "../statistics-service";

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
