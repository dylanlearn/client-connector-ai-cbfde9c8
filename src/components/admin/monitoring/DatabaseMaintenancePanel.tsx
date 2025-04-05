import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Database, RefreshCw, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { 
  vacuumTable, 
  refreshDatabaseStatistics, 
  subscribeToDbRefresh,
  verifyDeadRowPercentages,
  cleanupFullDatabase,
  DatabaseStatistics,
  TableStatistics
} from "@/utils/database/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface MaintenanceStatus {
  inProgress: boolean;
  status?: 'success' | 'error';
  message?: string;
}

interface DatabasePerformanceTableProps {
  tables: TableStatistics[];
  maintenanceStatus: Record<string, MaintenanceStatus>;
  onVacuumTable: (tableName: string) => Promise<void>;
}

export function DatabaseMaintenancePanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
    details?: any;
  } | null>(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState<Record<string, MaintenanceStatus>>({});
  const [autoVacuumEnabled, setAutoVacuumEnabled] = useState<boolean>(false);
  const [autoVacuumInterval, setAutoVacuumInterval] = useState<number | null>(null);
  const [databaseStats, setDatabaseStats] = useState<DatabaseStatistics | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToDbRefresh((stats) => {
      console.log("DatabaseMaintenancePanel received new stats:", stats);
      setDatabaseStats(stats);
    });
    
    handleRefreshStats();
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRefreshStats = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      console.log("DatabaseMaintenancePanel: Refreshing statistics...");
      const refreshedStats = await refreshDatabaseStatistics(true);
      console.log("DatabaseMaintenancePanel: Refreshed statistics:", refreshedStats);
      
      if (refreshedStats) {
        setDatabaseStats(refreshedStats);
      }
      
      const verificationResult = await verifyDeadRowPercentages();
      console.log("Verification result:", verificationResult);
      
      if (!verificationResult.accurate) {
        console.warn("Some discrepancies detected between UI and actual database statistics");
      }
    } catch (error) {
      console.error("Error refreshing database statistics:", error);
      toast.error("Failed to refresh statistics", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDatabaseMaintenance = async (action: 'vacuum' | 'analyze' | 'reindex', tables: string[] = ['profiles', 'projects', 'user_memories', 'global_memories', 'intake_forms']) => {
    setIsLoading(true);
    setActionType(action);
    
    try {
      console.log(`Running ${action} on tables:`, tables);
      
      const { data, error } = await supabase.functions.invoke('database-maintenance', {
        body: { action, tables }
      });

      console.log(`${action} response:`, data, error);

      if (error) {
        throw error;
      }

      if (data?.failed_tables && data.failed_tables.length > 0) {
        console.warn(`Some tables failed during ${action}:`, data.failed_tables);
        toast.warning(`${action.toUpperCase()} completed with warnings`, {
          description: `Failed on tables: ${data.failed_tables.map((ft: any) => ft.table).join(', ')}`
        });
      }

      if (data?.success_tables && data.success_tables.length > 0) {
        setLastResult({
          success: true,
          message: `${action.toUpperCase()} completed successfully on ${data.success_tables.length} tables`,
          timestamp: new Date(),
          details: data
        });

        toast.success(`Database maintenance completed`, {
          description: `${action.toUpperCase()} operation finished on ${data.success_tables.length} tables`
        });
        
        await handleRefreshStats();
      } else {
        throw new Error(`No tables were successfully processed`);
      }
    } catch (error: any) {
      console.error(`Error running ${action}:`, error);
      setLastResult({
        success: false,
        message: error.message || `Failed to run ${action.toUpperCase()} operation`,
        timestamp: new Date()
      });
      
      toast.error(`Maintenance failed`, {
        description: error.message || `Failed to run ${action.toUpperCase()} operation`
      });
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const handleCleanupAllTables = async () => {
    setIsLoading(true);
    setActionType('full-vacuum');
    
    try {
      const result = await cleanupFullDatabase();
      
      if (result.success) {
        setLastResult({
          success: true,
          message: result.message,
          timestamp: new Date(),
          details: result.details
        });
        
        await handleRefreshStats();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error during full database cleanup:', error);
      setLastResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred during cleanup',
        timestamp: new Date()
      });
      
      toast.error(`Full database cleanup failed`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const runVacuum = () => handleDatabaseMaintenance('vacuum');
  const analyzeDatabase = () => handleDatabaseMaintenance('analyze');
  const reindexDatabase = () => handleDatabaseMaintenance('reindex');

  const vacuumSingleTable = async (tableName: string) => {
    setMaintenanceStatus(prev => ({
      ...prev,
      [tableName]: { inProgress: true }
    }));
    
    try {
      const result = await vacuumTable(tableName);
      
      if (result.success) {
        toast.success(`Table maintenance completed`, {
          description: `VACUUM completed successfully on table: ${tableName}`
        });
        
        setMaintenanceStatus(prev => ({
          ...prev,
          [tableName]: { 
            inProgress: false,
            status: 'success',
            message: `Vacuumed at ${new Date().toLocaleTimeString()}`
          }
        }));
        
        await handleRefreshStats();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error(`Error vacuuming table ${tableName}:`, error);
      toast.error(`Table maintenance failed`, {
        description: error.message || `Failed to vacuum table ${tableName}`
      });
      
      setMaintenanceStatus(prev => ({
        ...prev,
        [tableName]: { 
          inProgress: false,
          status: 'error',
          message: error.message
        }
      }));
    }
  };

  const cleanupCache = async () => {
    setIsLoading(true);
    setActionType('cache');
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-expired-cache');

      console.log('Cache cleanup response:', data, error);

      if (error) {
        throw error;
      }

      setLastResult({
        success: true,
        message: `Removed ${data?.entriesRemoved || 0} expired cache entries`,
        timestamp: new Date()
      });

      toast.success("Cache cleanup completed", {
        description: `Removed ${data?.entriesRemoved || 0} expired cache entries`,
      });
      
      await handleRefreshStats();
    } catch (error: any) {
      console.error('Error cleaning up cache:', error);
      setLastResult({
        success: false,
        message: error.message || "Failed to clean up cache",
        timestamp: new Date()
      });
      
      toast.error("Cache cleanup failed", {
        description: error.message || "Failed to clean up expired cache entries",
      });
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const DatabasePerformanceTable = ({ tables, maintenanceStatus, onVacuumTable }: DatabasePerformanceTableProps) => {
    if (!tables || tables.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No table statistics available</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Live Rows</TableHead>
            <TableHead>Dead Rows</TableHead>
            <TableHead>Dead Row %</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map((table) => {
            const tableStatus = maintenanceStatus[table.table] || { inProgress: false };
            const deadRowRatio = table.dead_row_ratio;
            let badgeColor = "bg-green-500"; 
            
            if (deadRowRatio > 20) {
              badgeColor = "bg-red-500";
            } else if (deadRowRatio > 10) {
              badgeColor = "bg-yellow-500";
            }

            return (
              <TableRow key={table.table}>
                <TableCell className="font-mono text-sm">{table.table}</TableCell>
                <TableCell>{table.live_rows.toLocaleString()}</TableCell>
                <TableCell>{table.dead_rows.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-white text-xs ${badgeColor}`}>
                    {deadRowRatio.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onVacuumTable(table.table)}
                      disabled={tableStatus.inProgress}
                      className="flex items-center gap-1"
                    >
                      {tableStatus.inProgress ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Vacuuming...
                        </>
                      ) : (
                        <>Vacuum</>
                      )}
                    </Button>
                    {tableStatus.status && (
                      <span className={`text-xs ${tableStatus.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {tableStatus.message}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Database Maintenance
            </CardTitle>
            <CardDescription>
              Run database maintenance operations to optimize performance
            </CardDescription>
          </div>
          <Button
            onClick={handleRefreshStats}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Stats
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleCleanupAllTables}
            disabled={isLoading}
            className="flex items-center gap-2 w-full md:w-auto"
            variant="destructive"
            size="lg"
          >
            {isLoading && actionType === 'full-vacuum' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Clean All Database Tables
          </Button>
          <p className="text-sm text-muted-foreground">
            Run complete database cleanup to fix tables with high dead row percentages
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Button 
            onClick={runVacuum}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && actionType === 'vacuum' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Run VACUUM
          </Button>
          
          <Button 
            onClick={analyzeDatabase}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading && actionType === 'analyze' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Run ANALYZE
          </Button>
          
          <Button 
            onClick={reindexDatabase}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading && actionType === 'reindex' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Run REINDEX
          </Button>
          
          <Button 
            onClick={cleanupCache}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading && actionType === 'cache' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Clean Cache
          </Button>
        </div>

        {lastResult && (
          <Alert variant={lastResult.success ? "default" : "destructive"}>
            {lastResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{lastResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{lastResult.message}</p>
              {lastResult.details && lastResult.details.success_tables && (
                <p className="text-xs">
                  Processed tables: {lastResult.details.success_tables.join(', ')}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {lastResult.timestamp.toLocaleString()}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {databaseStats?.table_stats && databaseStats.table_stats.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Database Table Statistics</h3>
              <div className="text-sm text-muted-foreground">
                Last refreshed: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <DatabasePerformanceTable 
              tables={databaseStats.table_stats} 
              maintenanceStatus={maintenanceStatus}
              onVacuumTable={vacuumSingleTable}
            />
          </>
        ) : refreshing ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading statistics...</span>
          </div>
        ) : (
          <div className="text-center py-8">
            <Database className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No database statistics loaded</p>
            <Button onClick={handleRefreshStats} variant="outline" className="mt-4">
              Load Statistics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
