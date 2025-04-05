
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Database, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export function DatabaseMaintenancePanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
    details?: any;
  } | null>(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState<Record<string, {
    inProgress: boolean;
    status?: 'success' | 'error';
    message?: string;
  }>>({});
  const [autoVacuumEnabled, setAutoVacuumEnabled] = useState<boolean>(false);
  const [autoVacuumInterval, setAutoVacuumInterval] = useState<number | null>(null);
  const { toast: uiToast } = useToast();

  // Enhanced database maintenance handler with better error handling and logging
  const handleDatabaseMaintenance = async (action: 'vacuum' | 'analyze' | 'reindex', tables: string[] = ['profiles', 'projects', 'user_memories', 'global_memories']) => {
    setIsLoading(true);
    setActionType(action);
    
    try {
      console.log(`Running ${action} on tables:`, tables);
      
      // Call the edge function
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

  const runVacuum = () => handleDatabaseMaintenance('vacuum');
  const analyzeDatabase = () => handleDatabaseMaintenance('analyze');
  const reindexDatabase = () => handleDatabaseMaintenance('reindex');

  const vacuumSingleTable = async (tableName: string) => {
    // Set the specific table's maintenance status to in progress
    setMaintenanceStatus(prev => ({
      ...prev,
      [tableName]: { inProgress: true }
    }));
    
    try {
      console.log(`Running VACUUM on single table: ${tableName}`);
      
      // Call the edge function for a single table
      const { data, error } = await supabase.functions.invoke('database-maintenance', {
        body: { action: 'vacuum', tables: [tableName] }
      });

      console.log(`VACUUM single table response:`, data, error);

      if (error) {
        throw error;
      }

      if (data?.failed_tables && data.failed_tables.length > 0) {
        throw new Error(`Failed to vacuum table ${tableName}: ${data.failed_tables[0]?.error || 'Unknown error'}`);
      }

      if (data?.success_tables && data.success_tables.includes(tableName)) {
        toast.success(`Table maintenance completed`, {
          description: `VACUUM completed successfully on table: ${tableName}`
        });
        
        // Update the maintenance status to success
        setMaintenanceStatus(prev => ({
          ...prev,
          [tableName]: { 
            inProgress: false,
            status: 'success',
            message: `Vacuumed at ${new Date().toLocaleTimeString()}`
          }
        }));
      } else {
        throw new Error(`Table ${tableName} was not successfully vacuumed`);
      }
    } catch (error: any) {
      console.error(`Error vacuuming table ${tableName}:`, error);
      toast.error(`Table maintenance failed`, {
        description: error.message || `Failed to vacuum table ${tableName}`
      });
      
      // Update maintenance status to error
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
      // Call the edge function to clean up expired cache entries
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
  
  // Enhanced database performance display component
  const DatabasePerformanceTable = ({ tables }: { tables: any[] }) => {
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
                    {table.dead_row_ratio.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => vacuumSingleTable(table.table)}
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
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database Maintenance
        </CardTitle>
        <CardDescription>
          Run database maintenance operations to optimize performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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

        {lastResult?.details?.table_stats && (
          <DatabasePerformanceTable tables={lastResult.details.table_stats} />
        )}
      </CardContent>
    </Card>
  );
}
