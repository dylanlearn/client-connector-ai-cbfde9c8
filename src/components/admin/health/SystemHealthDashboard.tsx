
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  ArrowDownIcon,
  ArrowUpIcon,
  Check,
  Clock,
  Database,
  HardDrive,
  RefreshCw,
  Server,
  Shield,
  X,
  Loader2
} from "lucide-react";
import { formatDistance } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SystemMonitoringRecord } from "@/utils/monitoring/types";

export function SystemHealthDashboard() {
  const [healthStatus, setHealthStatus] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [dbPerformance, setDbPerformance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load all system health data
  const loadHealthData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load system health status
      const { data: healthData, error: healthError } = await supabase
        .from('system_health_status')
        .select('*');
      
      if (healthError) throw healthError;
      setHealthStatus(healthData || []);

      // Load active system alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      
      if (alertsError) throw alertsError;
      setSystemAlerts(alertsData || []);

      // Run database performance check
      const { data: dbData, error: dbError } = await supabase.rpc('check_database_performance');
      
      if (dbError) throw dbError;
      setDbPerformance(dbData);

    } catch (error: any) {
      console.error("Error loading health data:", error);
      toast({
        title: "Error loading health data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Record a system health check
  const recordHealthCheck = useCallback(async (component: string) => {
    try {
      const startTime = performance.now();
      const response = await fetch(`https://bmkhbqxukiakhafqllux.supabase.co/rest/v1/${component}?limit=1`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2hicXh1a2lha2hhZnFsbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODY2OTksImV4cCI6MjA1OTA2MjY5OX0.uqt5fokVkLgGQOlqF2BLiMgW4ZSy9gxkZXy35o97iXI'
        }
      });
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      const status = response.ok ? 'healthy' : 'unhealthy';
      const details = {
        status_code: response.status,
        status_text: response.statusText,
        response_time_ms: responseTime
      };
      
      // Record the health check in the database
      await supabase.rpc('record_health_check', { 
        p_component: component,
        p_status: status,
        p_response_time_ms: responseTime,
        p_details: details
      });
      
      toast({
        title: "Health check recorded",
        description: `${component} is ${status} (${responseTime}ms)`,
        variant: status === 'healthy' ? 'default' : 'destructive'
      });
      
      // Refresh data
      loadHealthData();
    } catch (error: any) {
      console.error(`Error checking ${component} health:`, error);
      
      // Record the failed health check
      await supabase.rpc('record_health_check', { 
        p_component: component,
        p_status: 'error',
        p_response_time_ms: null,
        p_details: { error: error.message }
      });
      
      toast({
        title: `${component} health check failed`,
        description: error.message,
        variant: "destructive"
      });
    }
  }, [loadHealthData, toast]);

  // Resolve a system alert
  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolution_notes: 'Marked as resolved from admin dashboard'
        })
        .eq('id', alertId);
      
      if (error) throw error;
      
      // Remove the alert from state
      setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert resolved",
        description: "The system alert has been marked as resolved."
      });
    } catch (error: any) {
      console.error("Error resolving alert:", error);
      toast({
        title: "Error resolving alert",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Load health data on mount
  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]);

  // Get status color based on status
  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-500";
    
    switch (status.toLowerCase()) {
      case 'healthy':
        return "bg-green-500";
      case 'degraded':
        return "bg-yellow-500";
      case 'unhealthy':
      case 'error':
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status: string | null) => {
    if (!status) return <Clock className="h-4 w-4" />;
    
    switch (status.toLowerCase()) {
      case 'healthy':
        return <Check className="h-4 w-4" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy':
      case 'error':
        return <X className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get severity color for alerts
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return "bg-red-500";
      case 'warning':
        return "bg-yellow-500";
      case 'info':
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">System Health Status</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadHealthData}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Quick status overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))
        ) : healthStatus.length > 0 ? (
          healthStatus.map((status) => (
            <Card key={status.component}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {status.component === 'database' && <Database className="h-5 w-5" />}
                  {status.component === 'storage' && <HardDrive className="h-5 w-5" />}
                  {status.component === 'api' && <Server className="h-5 w-5" />}
                  {status.component === 'auth' && <Shield className="h-5 w-5" />}
                  {status.component}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(status.latest_status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(status.latest_status)}
                      <span>{status.latest_status || 'Unknown'}</span>
                    </div>
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {status.issues_last_24h > 0 && (
                      <span className="text-amber-500 font-medium">
                        {status.issues_last_24h} issue{status.issues_last_24h > 1 ? 's' : ''} (24h)
                      </span>
                    )}
                  </div>
                </div>
                
                {status.avg_response_time_1h && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Response time (1h avg)</p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={Math.min((status.avg_response_time_1h / 1000) * 100, 100)} 
                        className="h-2"
                      />
                      <span className="text-xs font-mono">
                        {Math.round(status.avg_response_time_1h)}ms
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => recordHealthCheck(status.component)}
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Run health check
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle>No Health Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No system health data has been recorded yet. Run a health check to get started.
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => recordHealthCheck('database')}>
                  <Database className="h-4 w-4 mr-2" />
                  Check Database
                </Button>
                <Button size="sm" onClick={() => recordHealthCheck('api')}>
                  <Server className="h-4 w-4 mr-2" />
                  Check API
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Active Alerts */}
      {systemAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Active Alerts</h3>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <Alert key={alert.id} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {alert.component}
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="flex justify-between items-start mt-1">
                  <div>
                    <p>{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Detailed information tabs */}
      <Tabs defaultValue="database">
        <TabsList>
          <TabsTrigger value="database">Database Performance</TabsTrigger>
          <TabsTrigger value="checks">Recent Health Checks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Database Tables Performance</span>
                {dbPerformance && (
                  <span className="text-sm text-muted-foreground">
                    Last checked: {new Date(dbPerformance.timestamp).toLocaleString()}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Performance metrics for database tables including dead tuples and vacuum requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dbPerformance ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table Name</TableHead>
                        <TableHead>Live Rows</TableHead>
                        <TableHead>Dead Rows</TableHead>
                        <TableHead>Dead Row Ratio</TableHead>
                        <TableHead>Sequential Scans</TableHead>
                        <TableHead>Index Scans</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dbPerformance.table_stats && dbPerformance.table_stats.map((table: any) => (
                        <TableRow key={table.table}>
                          <TableCell className="font-medium">{table.table}</TableCell>
                          <TableCell>{table.live_rows.toLocaleString()}</TableCell>
                          <TableCell>{table.dead_rows.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={Math.min(table.dead_row_ratio, 100)} 
                                className={`h-2 ${table.dead_row_ratio > 20 ? 'bg-red-200' : 'bg-gray-200'}`}
                              />
                              <span>{table.dead_row_ratio.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{table.sequentialScans}</TableCell>
                          <TableCell>{table.indexScans}</TableCell>
                          <TableCell>
                            {table.dead_row_ratio > 20 ? (
                              <Badge variant="destructive">
                                <Clock className="h-3 w-3 mr-1" />
                                Vacuum needed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                Healthy
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading database performance data...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checks">
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Checks</CardTitle>
              <CardDescription>
                History of system health checks across all components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentHealthChecks />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Subcomponent for recent health checks
function RecentHealthChecks() {
  const [checks, setChecks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadHealthChecks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('system_health_checks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        setChecks(data || []);
      } catch (error) {
        console.error("Error loading health checks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHealthChecks();
  }, []);
  
  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return "bg-green-500";
      case 'degraded':
        return "bg-yellow-500";
      case 'unhealthy':
      case 'error':
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : checks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No health checks found.
              </TableCell>
            </TableRow>
          ) : (
            checks.map((check) => (
              <TableRow key={check.id}>
                <TableCell className="font-medium">{check.component}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {check.response_time_ms ? `${check.response_time_ms}ms` : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <span title={new Date(check.created_at).toLocaleString()}>
                      {formatDistance(new Date(check.created_at), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      // View details in console for now
                      console.log('Health check details:', check.details);
                    }}
                  >
                    <Activity className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
