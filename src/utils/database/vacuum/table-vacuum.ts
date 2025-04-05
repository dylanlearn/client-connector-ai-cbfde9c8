
import { refreshDatabaseStatistics } from "../statistics-service";
import { vacuumTable } from "./vacuum-core";
import { toast } from "sonner";
import { MaintenanceResult } from "../types";

/**
 * Vacuum multiple tables based on recommendations
 * 
 * @param tables - Array of table names to vacuum
 */
export async function vacuumRecommendedTables(tables: string[]): Promise<MaintenanceResult> {
  if (!tables || !tables.length) {
    return {
      success: false,
      message: "No tables specified for vacuum"
    };
  }
  
  try {
    console.log(`Vacuum service: Vacuuming ${tables.length} recommended tables`, tables);
    
    const results = await Promise.all(
      tables.map(table => vacuumTable(table, { analyze: true }))
    );
    
    const successfulTables = results
      .filter(result => result.success)
      .map((_, index) => tables[index]);
      
    const failedTables = results
      .filter(result => !result.success)
      .map((_, index) => tables[index]);
    
    if (successfulTables.length > 0) {
      toast.success(`Tables maintained`, {
        description: `Successfully processed ${successfulTables.length} tables`
      });
      
      // Refresh stats after maintenance
      setTimeout(() => {
        refreshDatabaseStatistics(false);
      }, 1000);
    }
    
    if (failedTables.length > 0) {
      console.warn('Some recommended tables failed vacuum:', failedTables);
    }
    
    return {
      success: successfulTables.length > 0,
      message: `Completed vacuum on ${successfulTables.length} tables. ${failedTables.length} tables failed.`,
      details: {
        successfulTables,
        failedTables
      }
    };
  } catch (error) {
    console.error('Error in vacuumRecommendedTables:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during table vacuum'
    };
  }
}
