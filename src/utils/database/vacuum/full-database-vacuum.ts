
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenanceResult } from "../types";
import { refreshDatabaseStatistics } from "../statistics-service";
import { recordTableVacuumed } from "../maintenance-tracker";

/**
 * Run database maintenance on all tables or specific tables
 * This performs a full vacuum operation to reclaim space and optimize tables
 */
export async function cleanupFullDatabase(tables?: string[]): Promise<MaintenanceResult> {
  try {
    console.log("Starting full database cleanup");
    toast.loading("Cleaning database tables...", {
      duration: 30000 // 30 seconds timeout for potentially long operation
    });
    
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { 
        action: 'vacuum',
        tables: tables // If provided, clean only these tables; otherwise clean all tables
      }
    });
    
    if (error) {
      console.error('Error running database cleanup:', error);
      toast.error("Database cleanup failed", {
        description: error.message
      });
      return {
        success: false,
        message: error.message
      };
    }
    
    // Check results
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
      
      // Refresh database statistics after cleanup
      await refreshDatabaseStatistics(false);
      
      return {
        success: true,
        message: `Database cleanup complete: ${successCount} tables cleaned${failCount ? `, ${failCount} failed` : ''}`,
        details: data
      };
    } else {
      toast.error("Database cleanup failed", {
        description: data?.failed_tables?.length > 0 
          ? `Failed tables: ${data.failed_tables.map((ft: any) => ft.table).join(', ')}` 
          : "No tables were successfully cleaned"
      });
      
      return {
        success: false,
        message: "No tables were successfully cleaned",
        details: data
      };
    }
  } catch (error) {
    console.error('Error cleaning full database:', error);
    toast.error("Database cleanup failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
