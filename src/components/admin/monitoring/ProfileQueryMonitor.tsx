
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertCircle,
  DatabaseIcon,
  RefreshCw,
  Info,
  CheckCircle2
} from "lucide-react";
import { getProfileQueryStatistics, formatQueryTime, checkPgStatStatementsEnabled } from "@/utils/monitoring/query-stats";
import { toast } from "sonner";

type ProfileQueryStat = {
  query: string;
  calls: number;
  total_exec_time: number;
  mean_exec_time: number;
};

type ProfileQueryStats = {
  timestamp: string;
  queries: ProfileQueryStat[];
  extension_enabled?: boolean;
  error?: string;
};

export function ProfileQueryMonitor() {
  const [queryStats, setQueryStats] = useState<ProfileQueryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extensionEnabled, setExtensionEnabled] = useState<boolean | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(false);

  const fetchProfileQueryStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First verify if the extension is available
      setCheckingSetup(true);
      const isEnabled = await checkPgStatStatementsEnabled();
      setExtensionEnabled(isEnabled);
      setCheckingSetup(false);
      
      if (!isEnabled) {
        setError('pg_stat_statements extension is not enabled. Query monitoring requires this extension.');
        setQueryStats({
          timestamp: new Date().toISOString(),
          queries: []
        });
        setLoading(false);
        return;
      }
      
      // Fetch the actual query statistics
      const data = await getProfileQueryStatistics();
      
      if (!data) {
        throw new Error('Failed to fetch profile query statistics');
      }
      
      // Update extension status based on response
      if (data.extension_enabled !== undefined) {
        setExtensionEnabled(data.extension_enabled);
      }
      
      if (data.error) {
        setError(data.error);
      } else {
        setError(null);
      }
      
      setQueryStats(data);
      
    } catch (err: any) {
      console.error('Error fetching profile query stats:', err);
      setError(err.message || 'Failed to fetch profile query statistics');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndFixSetup = async () => {
    setCheckingSetup(true);
    try {
      // Try to fix the setup via our helper function
      const isEnabled = await checkPgStatStatementsEnabled();
      setExtensionEnabled(isEnabled);
      
      if (isEnabled) {
        toast.success("Extension check completed", {
          description: "The pg_stat_statements extension appears to be working."
        });
      } else {
        toast.error("Extension not available", {
          description: "The pg_stat_statements extension couldn't be detected. Check the SQL setup."
        });
      }
    } catch (error) {
      console.error("Error verifying extension setup:", error);
      toast.error("Setup verification failed", {
        description: "Could not verify the extension status."
      });
    } finally {
      setCheckingSetup(false);
    }
  };

  useEffect(() => {
    fetchProfileQueryStats();
    
    // Set up a refresh interval for 60 seconds
    const interval = setInterval(fetchProfileQueryStats, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Profile Query Monitor</h3>
          <p className="text-sm text-muted-foreground">
            Track queries hitting the profiles table to identify performance issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={verifyAndFixSetup} 
            size="sm" 
            variant="outline"
            className="flex gap-2 items-center"
            disabled={checkingSetup}
          >
            {checkingSetup ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Checking...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Verify Setup</>
            )}
          </Button>
          
          <Button 
            onClick={fetchProfileQueryStats} 
            size="sm"
            variant="outline"
            className="flex gap-2 items-center"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {extensionEnabled === false && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Configuration Issue</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              The pg_stat_statements extension appears to be disabled or not properly configured.
              This extension is required to collect query statistics.
            </p>
            <p>
              Please make sure you've run the SQL setup script in your Supabase SQL editor.
              After running the script, it may take a few minutes for the extension to start collecting data.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-center py-4">Loading query statistics...</p>}

      {!loading && !error && queryStats && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5" />
                Profile Queries Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Last updated: {new Date(queryStats.timestamp).toLocaleString()}
                {extensionEnabled !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${extensionEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Extension: {extensionEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>

              {queryStats.queries && queryStats.queries.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Query</TableHead>
                        <TableHead className="w-[100px]">Calls</TableHead>
                        <TableHead className="w-[140px]">Total Time</TableHead>
                        <TableHead className="w-[140px]">Mean Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queryStats.queries.map((stat, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            <div className="max-w-md overflow-auto">
                              {stat.query}
                            </div>
                          </TableCell>
                          <TableCell>{stat.calls.toLocaleString()}</TableCell>
                          <TableCell>{formatQueryTime(stat.total_exec_time)}</TableCell>
                          <TableCell>{formatQueryTime(stat.mean_exec_time)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center border rounded-md bg-gray-50">
                  <p className="text-md font-medium mb-2">No profile queries found in the monitoring period</p>
                  <p className="text-sm text-muted-foreground">This could be because:</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 max-w-md mx-auto text-left px-4">
                    <li>No recent queries have accessed the profiles table</li>
                    <li>The pg_stat_statements extension needs more time to collect data</li>
                    <li>Query statistics were recently reset</li>
                    <li>You need to execute some queries against the profiles table to generate data</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Instructions & Troubleshooting</AlertTitle>
            <AlertDescription>
              <div className="space-y-4 mt-2">
                <div>
                  <h4 className="font-medium">Prerequisites:</h4>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>The pg_stat_statements extension must be enabled in Supabase</li>
                    <li>Run the SQL script provided in <code>src/utils/monitoring/setup-pg-stat-statements.sql</code></li>
                    <li>Perform some database operations on the profiles table to generate query statistics</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Optimization Tips:</h4>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>Look for queries with high call counts that could be batched or cached</li>
                    <li>Check for missing WHERE clauses causing full table scans</li>
                    <li>Consider adding additional indexes for frequently filtered columns</li>
                    <li>Use React Query's caching to reduce redundant profile queries</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
