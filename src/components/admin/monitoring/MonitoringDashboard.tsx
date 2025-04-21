
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SystemStatus } from '@/utils/monitoring/types';
import { getSystemStatus, getSystemMetrics } from '@/utils/monitoring/system-status';
import { getApiUsageMetrics } from '@/utils/monitoring/api-usage';
import { StatusBadge } from './controls/StatusBadge';
import { MonitoringControls } from './controls/MonitoringControls';
import { ApiUsageMetrics } from './ApiUsageMetrics';
import { ClientErrorMonitoring } from './ClientErrorMonitoring';
import { ProfileQueryMonitor } from './ProfileQueryMonitor';
import { DatabaseMaintenancePanel } from './DatabaseMaintenancePanel';

export function MonitoringDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'week'>('day');

  const fetchSystemStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getSystemStatus();
      setSystemStatus(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError('Failed to load system status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();

    // Set up auto-refresh if enabled
    let intervalId: number | undefined;
    if (autoRefresh) {
      intervalId = window.setInterval(fetchSystemStatus, 60000); // Refresh every minute
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  const handleRefresh = () => {
    fetchSystemStatus();
  };

  const handlePeriodChange = (period: 'hour' | 'day' | 'week') => {
    setSelectedPeriod(period);
  };

  const handleAutoRefreshToggle = (enabled: boolean) => {
    setAutoRefresh(enabled);
  };

  if (isLoading && !systemStatus) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Monitoring</h2>
          <p className="text-muted-foreground">
            Monitor system health, performance and errors
          </p>
        </div>
        
        <MonitoringControls 
          onRefresh={handleRefresh} 
          isRefreshing={isLoading}
          onPeriodChange={handlePeriodChange}
          selectedPeriod={selectedPeriod}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={handleAutoRefreshToggle}
        />
      </div>

      {systemStatus && (
        <div className="grid gap-6">
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">System Status</CardTitle>
                <StatusBadge status={systemStatus.status} showText />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(systemStatus.components).map(([key, component]) => (
                  <Card key={key} className="overflow-hidden">
                    <CardHeader className="py-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{key}</CardTitle>
                        <StatusBadge status={component.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {Object.entries(component.metrics).map(([metric, value]) => (
                          <div key={metric} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{metric}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="usage" className="w-full">
            <TabsList>
              <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
              <TabsTrigger value="errors">Error Monitoring</TabsTrigger>
              <TabsTrigger value="queries">Query Performance</TabsTrigger>
              <TabsTrigger value="database">Database Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="usage" className="space-y-4 pt-4">
              <ApiUsageMetrics period={selectedPeriod} />
            </TabsContent>
            
            <TabsContent value="errors" className="space-y-4 pt-4">
              <ClientErrorMonitoring />
            </TabsContent>
            
            <TabsContent value="queries" className="space-y-4 pt-4">
              <ProfileQueryMonitor />
            </TabsContent>
            
            <TabsContent value="database" className="space-y-4 pt-4">
              <DatabaseMaintenancePanel />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
