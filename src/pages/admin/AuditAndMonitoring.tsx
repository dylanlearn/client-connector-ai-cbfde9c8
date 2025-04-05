
import React, { useState, useEffect, useCallback } from 'react';
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
  Clock
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

const AuditAndMonitoring = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [healthCheck, setHealthCheck] = useState(null);
  const [databasePerformance, setDatabasePerformance] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingTableId, setProcessingTableId] = useState(null); // Track which table is being vacuumed
  const [vacuumResults, setVacuumResults] = useState({});
  const supabaseAuditService = new SupabaseAuditService();
  const { toast: uiToast } = useToast();

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const healthCheckData = await supabaseAuditService.checkSupabaseHealth();
      setHealthCheck(healthCheckData);

      const performanceData = await supabaseAuditService.checkDatabasePerformance();
      setDatabasePerformance(performanceData);
      
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error("Refresh failed", {
        description: "Unable to refresh data",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [supabaseAuditService]);

  const vacuumTable = async (tableName) => {
    setProcessingTableId(tableName);
    setVacuumResults(prev => ({
      ...prev,
      [tableName]: { status: 'processing' }
    }));
    
    try {
      console.log(`Running VACUUM on table: ${tableName}`);
      
      // Call the edge function to vacuum specific table
      const { data, error } = await supabase.functions.invoke('database-maintenance', {
        body: { action: 'vacuum', tables: [tableName] }
      });

      if (error) {
        console.error('Error vacuuming table:', error);
        throw error;
      }

      console.log('VACUUM response:', data);

      if (data?.failed_tables && data.failed_tables.length > 0) {
        throw new Error(`Failed to vacuum table ${tableName}: ${data.failed_tables[0]?.error || 'Unknown error'}`);
      }

      if (data?.success_tables && data.success_tables.includes(tableName)) {
        toast.success("Table Maintenance Complete", {
          description: `VACUUM completed successfully on table: ${tableName}`,
        });
        
        setVacuumResults(prev => ({
          ...prev,
          [tableName]: { 
            status: 'success', 
            timestamp: new Date(),
            message: 'VACUUM completed successfully'
          }
        }));
        
        // Refresh data after vacuum to show updated stats
        await refreshData();
      } else {
        throw new Error(`Table ${tableName} was not successfully vacuumed`);
      }
    } catch (error) {
      console.error('Error vacuuming table:', error);
      toast.error("Maintenance Failed", {
        description: error.message || "Failed to vacuum table",
      });
      
      setVacuumResults(prev => ({
        ...prev,
        [tableName]: { 
          status: 'error', 
          timestamp: new Date(),
          message: error.message 
        }
      }));
    } finally {
      setProcessingTableId(null);
    }
  };

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const healthCheckData = await supabaseAuditService.checkSupabaseHealth();
        setHealthCheck(healthCheckData);

        const performanceData = await supabaseAuditService.checkDatabasePerformance();
        setDatabasePerformance(performanceData);
        
      } catch (error) {
        console.error('Error fetching audit data:', error);
        toast.error("Error loading data", {
          description: "Failed to load audit data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditData();
  }, []);

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
                <>Refresh</>
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
                      {healthCheck?.functions?.count || 0} functions deployed
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

            <ServiceHealthSection healthCheck={healthCheck} />
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Database Performance Metrics</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>Refresh Metrics</>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {databasePerformance?.table_stats ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-2 px-4 py-3 border-b bg-muted/50 font-medium">
                      <div>Table</div>
                      <div>Live Rows</div>
                      <div>Dead Rows</div>
                      <div>Dead Row %</div>
                      <div>Action</div>
                    </div>
                    <div className="divide-y">
                      {databasePerformance.table_stats.map((table, i) => {
                        const result = vacuumResults[table.table];
                        return (
                          <div key={i} className="grid grid-cols-5 gap-2 px-4 py-3">
                            <div className="font-mono text-sm">{table.table}</div>
                            <div>{table.live_rows.toLocaleString()}</div>
                            <div>{table.dead_rows.toLocaleString()}</div>
                            <div>
                              <Badge className={
                                table.dead_row_ratio > 20 
                                  ? "bg-red-500" 
                                  : table.dead_row_ratio > 10 
                                    ? "bg-yellow-500" 
                                    : "bg-green-500"
                              }>
                                {table.dead_row_ratio.toFixed(1)}%
                              </Badge>
                            </div>
                            <div>
                              <div className="flex flex-col gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => vacuumTable(table.table)}
                                  disabled={processingTableId === table.table}
                                  className="flex items-center gap-1"
                                >
                                  {processingTableId === table.table ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Vacuuming...
                                    </>
                                  ) : (
                                    <>Vacuum</>
                                  )}
                                </Button>
                                {result && (
                                  <span 
                                    className={`text-xs ${
                                      result.status === 'success' 
                                        ? 'text-green-600' 
                                        : result.status === 'error' 
                                          ? 'text-red-600' 
                                          : 'text-gray-600'
                                    }`}
                                  >
                                    {result.status === 'success' 
                                      ? `Success at ${result.timestamp.toLocaleTimeString()}`
                                      : result.status === 'error' 
                                        ? result.message || 'Failed' 
                                        : 'Processing...'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                    <p>Could not retrieve database performance data</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
