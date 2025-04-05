
import { supabase } from "@/integrations/supabase/client";
import { recordTableVacuumed } from "../maintenance-tracker";
import { toast } from "sonner";
import { MaintenanceResult } from "../types";

/**
 * Run full database cleanup on all tables
 */
export async function cleanupFullDatabase(): Promise<MaintenanceResult> {
  try {
    console.log('Vacuum service: Starting full database cleanup');
    
    // Call the serverless function to run vacuum on all tables
    const { data, error } = await supabase.functions.invoke('database-maintenance', {
      body: { action: 'vacuum_full' }
    });
    
    if (error) {
      console.error('Full database cleanup failed:', error);
      throw error;
    }
    
    // Record the maintenance status for each successful table
    if (data.success_tables && Array.isArray(data.success_tables)) {
      data.success_tables.forEach((table: string) => {
        recordTableVacuumed(table);
      });
      
      toast.success(`Database cleaned up successfully`, {
        description: `Processed ${data.success_tables.length} tables`
      });
    }
    
    if (data.failed_tables && data.failed_tables.length > 0) {
      console.warn('Some tables failed during full vacuum:', data.failed_tables);
    }
    
    return {
      success: true,
      message: `Database cleanup completed. ${data.success_tables?.length || 0} tables processed.`,
      details: data
    };
  } catch (error) {
    console.error('Error in cleanupFullDatabase:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred during database cleanup'
    };
  }
}
