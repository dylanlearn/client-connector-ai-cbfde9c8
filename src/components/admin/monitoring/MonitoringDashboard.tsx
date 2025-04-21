
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatusBadge } from "./controls/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon, ServerIcon, ShieldExclamationIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { createRealtimeSubscription } from '@/utils/realtime-utils';
import { supabase } from '@/integrations/supabase/client';
import { SystemHealthCheck } from '@/types/supabase-audit';

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    api: { status: 'healthy', responseTime: 230 },
    database: { status: 'healthy', connections: 12 },
    storage: { status: 'healthy', usage: 45.2 },
    memory: { status: 'healthy', usage: 35 },
    cpu: { status: 'healthy', usage: 40 }
  });
  
  // Subscribe to realtime updates for system health checks
  useEffect(() => {
    // Get initial data
    fetchSystemStatus();
    
    // Subscribe to health check updates
    const { unsubscribe } = createRealtimeSubscription(
      'system-health-checks',
      'system_health_checks',
      undefined,
      (payload) => {
        if (payload.new) {
          const healthCheck = payload.new as SystemHealthCheck;
          
          console.log('Received health check update:', healthCheck);
          
          // Update the component in the system status
          setSystemStatus(prev => ({
            ...prev,
            [healthCheck.component]: {
              ...prev[healthCheck.component as keyof typeof prev],
              status: healthCheck.status
            }
          }));
          
          // Show toast for critical issues
          if (healthCheck.status === 'critical' || healthCheck.status === 'unhealthy') {
            toast.error(`${healthCheck.component} health check failed`, {
              description: `The ${healthCheck.component} component is experiencing issues.`
            });
          }
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);
  
  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get latest health checks from database
      const { data: healthChecks, error } = await supabase
        .from('system_health_checks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching system status:', error);
        return;
      }
      
      // Process health checks
      if (healthChecks && healthChecks.length > 0) {
        const newStatus = { ...systemStatus };
        
        healthChecks.forEach(check => {
          if (newStatus[check.component as keyof typeof newStatus]) {
            newStatus[check.component as keyof typeof newStatus].status = check.status;
          }
        });
        
        setSystemStatus(newStatus);
      }
      
      toast.success('System status refreshed');
    } catch (err) {
      console.error('Error fetching system status:', err);
      toast.error('Failed to fetch system status');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">System Monitoring</h2>
        <Button 
          variant="outline" 
          onClick={fetchSystemStatus} 
          disabled={loading}
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <CardDescription className="text-xs">API health and response times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <StatusBadge status={systemStatus.api.status} />
              <span className="text-sm text-muted-foreground">{systemStatus.api.responseTime}ms</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <CardDescription className="text-xs">Database connections and query performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <StatusBadge status={systemStatus.database.status} />
              <span className="text-sm text-muted-foreground">{systemStatus.database.connections} active</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <CardDescription className="text-xs">Storage capacity and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <StatusBadge status={systemStatus.storage.status} />
              <span className="text-sm text-muted-foreground">{systemStatus.storage.usage}% used</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <CardDescription className="text-xs">System memory consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <StatusBadge status={systemStatus.memory.status} />
              <span className="text-sm text-muted-foreground">{systemStatus.memory.usage}% used</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
            <CardDescription className="text-xs">System CPU utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <StatusBadge status={systemStatus.cpu.status} />
              <span className="text-sm text-muted-foreground">{systemStatus.cpu.usage}% load</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Key system metrics and health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Alert>
                    <ServerIcon className="h-4 w-4" />
                    <AlertTitle>System is operational</AlertTitle>
                    <AlertDescription>
                      All components are running normally. Monitor for any changes in status.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What to Monitor</CardTitle>
                <CardDescription>Key metrics for system health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <h4 className="font-medium">API Response Times</h4>
                  <p className="text-sm text-muted-foreground">Watch for sudden increases in response times which may indicate API issues.</p>
                </div>
                <div>
                  <h4 className="font-medium">Database Connections</h4>
                  <p className="text-sm text-muted-foreground">Monitor connection count for potential connection leaks or overloads.</p>
                </div>
                <div>
                  <h4 className="font-medium">Error Rates</h4>
                  <p className="text-sm text-muted-foreground">Track error rates across services to identify problematic components.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShieldExclamationIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No active alerts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  System is operating normally. No alerts have been triggered.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CpuChipIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Performance monitoring active</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Collecting performance metrics. Detailed graphs will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Configuration</CardTitle>
              <CardDescription>Adjust monitoring settings and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure system monitoring parameters and notification thresholds.
              </p>
              <Button>Configure Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
