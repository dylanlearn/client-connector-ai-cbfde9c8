
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
  RefreshCw
} from "lucide-react";
import { getProfileQueryStatistics, formatQueryTime } from "@/utils/monitoring/query-stats";

type ProfileQueryStat = {
  query: string;
  calls: number;
  total_exec_time: number;
  mean_exec_time: number;
};

type ProfileQueryStats = {
  timestamp: string;
  queries: ProfileQueryStat[];
};

export function ProfileQueryMonitor() {
  const [queryStats, setQueryStats] = useState<ProfileQueryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileQueryStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProfileQueryStatistics();
      
      if (!data) {
        throw new Error('Failed to fetch profile query statistics');
      }
      
      setQueryStats(data);
    } catch (err: any) {
      console.error('Error fetching profile query stats:', err);
      setError(err.message || 'Failed to fetch profile query statistics');
    } finally {
      setLoading(false);
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
        <Button 
          onClick={fetchProfileQueryStats} 
          size="sm"
          variant="outline"
          className="flex gap-2 items-center"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
                <p>No profile queries found in the monitoring period.</p>
              )}
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Optimization Tips</AlertTitle>
            <AlertDescription>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Look for queries with high call counts that could be batched or cached</li>
                <li>Check for missing WHERE clauses causing full table scans</li>
                <li>Consider adding additional indexes for frequently filtered columns</li>
                <li>Use React Query's caching to reduce redundant profile queries</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
