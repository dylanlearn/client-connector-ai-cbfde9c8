
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileQueryTable from "./ProfileQueryTable";
import ProfileQuerySetupAlert from "./ProfileQuerySetupAlert";
import { useFetchErrorHandler } from "@/hooks/error-handling/use-fetch-error-handler";
import { LoadingStateWrapper } from "@/components/ui/LoadingStateWrapper";

interface QueryStatsResult {
  timestamp: string;
  extensionEnabled: boolean; // Changed to camelCase for consistency
  queries: Array<{
    query: string;
    calls: number;
    totalExecTime: number; // Changed to camelCase for consistency
    meanExecTime: number; // Changed to camelCase for consistency
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
      
      // Create a proper Promise that resolves with the response from the RPC call
      const fetchPromise = new Promise<any>(async (resolve, reject) => {
        const response = await supabase.rpc('get_profile_query_stats');
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
      
      const data = await wrapFetch(
        fetchPromise,
        'fetch stats'
      );
      
      if (!data) {
        throw new Error('No data returned from stats query');
      }

      // Convert snake_case to camelCase
      const formattedData: QueryStatsResult = {
        timestamp: data.timestamp,
        extensionEnabled: data.extension_enabled,
        queries: data.queries.map((q: any) => ({
          query: q.query,
          calls: q.calls,
          totalExecTime: q.total_exec_time,
          meanExecTime: q.mean_exec_time
        }))
      };

      if (!formattedData.extensionEnabled) {
        setSetupCompleted(false);
      } else {
        setSetupCompleted(true);
        setStats(formattedData);
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
      
      // Create a proper Promise that resolves with the response from the RPC call
      const setupPromise = new Promise<any>(async (resolve, reject) => {
        const response = await supabase.rpc('run_pg_stat_statements_setup');
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
      
      await wrapFetch(
        setupPromise,
        'setup script'
      );
      
      // Re-fetch stats after setup
      await fetchProfileQueryStats();
      
    } catch (err) {
      // Error already handled by wrapFetch
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!setupCompleted) {
      return <ProfileQuerySetupAlert onSetupClick={runSetupScript} />;
    }
    
    if (stats?.queries && stats.queries.length > 0) {
      return <ProfileQueryTable queries={stats.queries} timestamp={stats.timestamp} />;
    }
    
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No profile queries detected</AlertTitle>
        <AlertDescription>
          No profile-related queries have been executed yet or they haven't been captured by pg_stat_statements.
        </AlertDescription>
      </Alert>
    );
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
        <LoadingStateWrapper
          isLoading={isLoading}
          error={error}
          isEmpty={!setupCompleted || (stats?.queries?.length === 0)}
          emptyState={renderContent()}
        >
          {renderContent()}
        </LoadingStateWrapper>
      </CardContent>
    </Card>
  );
};

export default ProfileQueryMonitor;
