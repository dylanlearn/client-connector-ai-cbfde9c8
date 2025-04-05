import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  ActivitySquare, 
  Database, 
  Key, 
  HardDrive, 
  FunctionSquare,
  Clock,
  RefreshCw
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SupabaseAuditService } from '@/services/ai/supabase-audit-service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ServiceHealthSection } from '@/components/admin/supabase-audit/ServiceHealthSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { 
  refreshDatabaseStatistics, 
  subscribeToDbRefresh,
  DatabaseStatistics
} from '@/utils/database/index';
import { DatabaseMaintenancePanel } from '@/components/admin/monitoring/DatabaseMaintenancePanel';
import { SupabaseHealthCheck } from '@/types/supabase-audit';

interface HealthCheck {
  database?: {
    status: string;
    message: string;
    tables?: string[];
  };
  functions?: {
    status: string;
    count?: number;
    availableFunctions?: string[];
  };
  auth?: {
    status: string;
    message: string;
  };
  storage?: {
    status: string;
    message: string;
    buckets?: string[];
  };
  overall: string;
}

const AuditAndMonitoring = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [healthCheck, setHealthCheck] = useState<HealthCheck | null>(null);
  const [databasePerformance, setDatabasePerformance] = useState<DatabaseStatistics | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const supabaseAuditService = new SupabaseAuditService();
  const { toast: uiToast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToDbRefresh((stats) => {
      if (isMounted.current) {
        console.log("Database stats updated via subscription:", stats);
        setDatabasePerformance(stats);
        setLastRefreshed(new Date());
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshData = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true);
    setLoadError(null);
    
    try {
      const healthCheckData = await supabaseAuditService.checkSupabaseHealth();
      if (isMounted.current) {
        const adaptedHealthCheck: HealthCheck = {
          database: healthCheckData.database,
          functions: {
            ...healthCheckData.functions,
            count: healthCheckData.functions.availableFunctions?.length || 0
          },
          auth: healthCheckData.auth,
          storage: healthCheckData.storage,
          overall: healthCheckData.overall
        };
        setHealthCheck(adaptedHealthCheck);
      }

      const stats = await refreshDatabaseStatistics(true);
      
      if (isMounted.current) {
        if (!stats) {
          console.warn("No stats returned from refreshDatabaseStatistics");
        }
        setLastRefreshed(new Date());
      }
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      if (isMounted.current) {
        setLoadError(error.message || "Failed to load monitoring data");
      }
      toast.error("Refresh failed", {
        description: "Unable to refresh data. Please try again.",
      });
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    }
  }, [isRefreshing, supabaseAuditService]);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        await refreshData();
      } catch (error) {
        console.error('Error in initial data fetch:', error);
        if (isMounted.current) {
          setLoadError(error.message || "Failed to load initial audit data");
          setIsLoading(false);
        }
      }
    };

    fetchAuditData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading system audit data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-1">System Audit & Monitoring</h1>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              {loadError}
              <div className="mt-2">
                <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Trying Again...
                    </>
                  ) : (
                    'Try Again'
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">System Audit & Monitoring</h1>
            <p className="text-muted-foreground">
              Monitor system health, performance, and security
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {formatDistanceToNow(lastRefreshed)} ago
            </div>
            <Button 
              variant="outline" 
              onClick={refreshData} 
              disabled={isRefreshing}
              className="gap-2"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh All
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database Performance</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="security">Security Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Database Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {healthCheck?.database?.status === 'ok' ? 'Healthy' : 'Issues Detected'}
                    </div>
                    <div>
                      {healthCheck?.database?.status === 'ok' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {healthCheck?.database?.message}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Edge Functions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {healthCheck?.functions?.status === 'ok' ? 'Running' : 'Issues Detected'}
                    </div>
                    <div>
                      {healthCheck?.functions?.status === 'ok' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <FunctionSquare className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm text-muted-foreground">
                      {healthCheck?.functions?.availableFunctions?.length || healthCheck?.functions?.count || 0} functions deployed
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {healthCheck?.overall === 'healthy' ? 'All Systems Go' : 'Attention Required'}
                    </div>
                    <div>
                      {healthCheck?.overall === 'healthy' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {healthCheck?.overall === 'healthy' 
                      ? 'All components operating normally' 
                      : 'Some services need attention'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <ServiceHealthSection healthCheck={healthCheck as unknown as SupabaseHealthCheck} />
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <DatabaseMaintenancePanel />

            {databasePerformance?.high_vacuum_tables && 
             databasePerformance.high_vacuum_tables.length > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Maintenance Recommended</AlertTitle>
                <AlertDescription>
                  {databasePerformance.high_vacuum_tables.length} tables have high dead row ratios and should be vacuumed.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-muted-foreground mt-2">
              Database stats collected: {databasePerformance?.timestamp && 
                format(new Date(databasePerformance.timestamp), 'PPpp')}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardContent className="pt-6">
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Service monitoring is in preview</AlertTitle>
                  <AlertDescription>
                    Detailed service monitoring data will be available in the next update.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-lg mb-2">Edge Function Status</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      View the status of all deployed edge functions
                    </p>
                    <Button>View Functions</Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-lg mb-2">Auth Configuration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage authentication providers and settings
                    </p>
                    <Button>View Auth Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardContent className="pt-6">
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Security audit is in preview</AlertTitle>
                  <AlertDescription>
                    Detailed security audit data will be available in the next update.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-lg mb-2">Auth Provider Audit</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review authentication provider security settings
                    </p>
                    <Button>Start Audit</Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-lg mb-2">RLS Policy Check</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Verify Row Level Security policies on tables
                    </p>
                    <Button>Check Policies</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AuditAndMonitoring;
