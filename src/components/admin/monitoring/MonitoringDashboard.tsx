
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationPanel } from './panels/ConfigurationPanel';
import { ErrorsPanel } from './panels/ErrorsPanel';
import { PerformancePanel } from './panels/PerformancePanel';
import { AlertsPanel } from './panels/AlertsPanel';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { StatusBadge } from './controls/StatusBadge';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = React.useState('configuration');
  const [statusData, setStatusData] = React.useState({
    api: { status: 'healthy', percentage: 100 },
    database: { status: 'healthy', percentage: 98 },
    cache: { status: 'warning', percentage: 85 },
    storage: { status: 'healthy', percentage: 99 }
  });

  // Set up real-time subscriptions for monitoring alerts
  useEffect(() => {
    // Subscribe to system_alerts table for real-time updates
    const alertsChannel = supabase.channel('monitoring-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_alerts'
        },
        (payload) => {
          const { severity, message, component } = payload.new;
          toast[severity === 'critical' ? 'error' : severity === 'warning' ? 'warning' : 'info'](
            `${component} alert: ${severity}`,
            { description: message }
          );
          
          // Update status data if component matches
          if (component && ['api', 'database', 'cache', 'storage'].includes(component)) {
            setStatusData(prev => ({
              ...prev,
              [component]: {
                ...prev[component as keyof typeof prev],
                status: severity === 'critical' ? 'error' : 
                       severity === 'warning' ? 'warning' : 'healthy'
              }
            }));
          }
        }
      )
      .subscribe();
      
    // Subscribe to system_monitoring table for real-time status updates
    const monitoringChannel = supabase.channel('system-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_monitoring'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { component, status, value } = payload.new;
            
            // Update component status if it matches our monitored components
            if (component && ['api', 'database', 'cache', 'storage'].includes(component)) {
              setStatusData(prev => ({
                ...prev,
                [component]: {
                  status: status === 'critical' ? 'error' : 
                          status === 'warning' ? 'warning' : 'healthy',
                  percentage: value || prev[component as keyof typeof prev].percentage
                }
              }));
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(monitoringChannel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Monitoring System</AlertTitle>
        <AlertDescription>
          Configure and monitor the application performance, errors, and system health.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">API Status</div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <StatusBadge status={statusData.api.status} />
              <span className="text-sm text-muted-foreground">{statusData.api.percentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Monitor for response time spikes</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">Database</div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <StatusBadge status={statusData.database.status} />
              <span className="text-sm text-muted-foreground">{statusData.database.percentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Watch for query execution times</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">Cache</div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <StatusBadge status={statusData.cache.status} />
              <span className="text-sm text-muted-foreground">{statusData.cache.percentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Check hit/miss ratio and memory usage</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">Storage</div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <StatusBadge status={statusData.storage.status} />
              <span className="text-sm text-muted-foreground">{statusData.storage.percentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Monitor file upload throughput</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration">
          <ConfigurationPanel />
        </TabsContent>
        
        <TabsContent value="errors">
          <ErrorsPanel />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformancePanel />
        </TabsContent>
        
        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
