
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileQueryTable from "./ProfileQueryTable";
import ProfileQuerySetupAlert from "./ProfileQuerySetupAlert";

interface QueryStatsResult {
  timestamp: string;
  extension_enabled: boolean;
  queries: Array<{
    query: string;
    calls: number;
    total_exec_time: number;
    mean_exec_time: number;
  }>;
}

export const ProfileQueryMonitor: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<QueryStatsResult | null>(null);
  const [setupCompleted, setSetupCompleted] = useState<boolean>(true);

  useEffect(() => {
    fetchProfileQueryStats();
  }, []);

  const fetchProfileQueryStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_profile_query_stats');
      
      if (error) {
        setError(`Error fetching query stats: ${error.message}`);
        setSetupCompleted(false);
        return;
      }

      if (data && !data.extension_enabled) {
        setSetupCompleted(false);
      } else {
        setSetupCompleted(true);
        setStats(data as QueryStatsResult);
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      setSetupCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  const runSetupScript = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Run the setup script via Supabase function
      const { error } = await supabase.rpc('run_pg_stat_statements_setup');
      
      if (error) {
        throw new Error(`Error running setup script: ${error.message}`);
      }
      
      // Re-fetch stats after setup
      await fetchProfileQueryStats();
      
    } catch (err) {
      setError(`Setup failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Profile Query Performance
        </CardTitle>
        <CardDescription>
          Monitor performance of database queries related to user profiles
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading stats...</div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !setupCompleted ? (
          <ProfileQuerySetupAlert onSetupClick={runSetupScript} />
        ) : stats?.queries && stats.queries.length > 0 ? (
          <ProfileQueryTable queries={stats.queries} timestamp={stats.timestamp} />
        ) : (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No profile queries detected</AlertTitle>
            <AlertDescription>
              No profile-related queries have been executed yet or they haven't been captured by pg_stat_statements.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileQueryMonitor;
