
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileQueryTable from "./ProfileQueryTable";
import ProfileQuerySetupAlert from "./ProfileQuerySetupAlert";
import { useFetchErrorHandler } from "@/hooks/error-handling/use-fetch-error-handler";

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
  const { isLoading, error, wrapFetch, setIsLoading } = useFetchErrorHandler({
    component: 'ProfileQueryMonitor',
    defaultErrorMessage: 'Failed to retrieve profile query statistics'
  });
  
  const [stats, setStats] = React.useState<QueryStatsResult | null>(null);
  const [setupCompleted, setSetupCompleted] = React.useState<boolean>(true);

  useEffect(() => {
    fetchProfileQueryStats();
  }, []);

  const fetchProfileQueryStats = async () => {
    try {
      setIsLoading(true);
      
      const { data, error: fetchError } = await wrapFetch(
        supabase.rpc('get_profile_query_stats'),
        'fetch stats'
      );
      
      if (fetchError) {
        throw fetchError;
      }

      if (data && !data.extension_enabled) {
        setSetupCompleted(false);
      } else {
        setSetupCompleted(true);
        setStats(data as QueryStatsResult);
      }
    } catch (err) {
      // Error already handled by wrapFetch
      setSetupCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const runSetupScript = async () => {
    try {
      setIsLoading(true);
      
      const { error: setupError } = await wrapFetch(
        supabase.rpc('run_pg_stat_statements_setup'),
        'setup script'
      );
      
      if (setupError) {
        throw setupError;
      }
      
      // Re-fetch stats after setup
      await fetchProfileQueryStats();
      
    } catch (err) {
      // Error already handled by wrapFetch
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading stats...</div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
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
