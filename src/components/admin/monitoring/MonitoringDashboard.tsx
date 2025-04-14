import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationPanel } from './panels/ConfigurationPanel';
import { ErrorsPanel } from './panels/ErrorsPanel';
import { PerformancePanel } from './panels/PerformancePanel';
import { AlertsPanel } from './panels/AlertsPanel';
import { useMonitoringConfig } from '@/hooks/use-monitoring-config';
import { getSystemStatus, getSystemMetrics } from '@/utils/monitoring/system-status';
import { SystemStatus, MonitoringConfiguration, SystemMonitoringRecord } from '@/utils/monitoring/types';
import { StatusBadge } from './controls/StatusBadge';

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<SystemMonitoringRecord[] | null>(null);
  const { config, updateConfig } = useMonitoringConfig('default');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [statusData, metricsData] = await Promise.all([
          getSystemStatus(),
          getSystemMetrics('day')
        ]);
        
        setSystemStatus(statusData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling every minute
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        
        {systemStatus && (
          <StatusBadge status={systemStatus.status} />
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            {/* Overview dashboard content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading status...</p>
                  ) : systemStatus ? (
                    <div>
                      <StatusBadge status={systemStatus.status} size="lg" />
                      <p className="mt-4">Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p>Status unavailable</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Add more overview cards here */}
            </div>
          </TabsContent>
          
          <TabsContent value="errors">
            <ErrorsPanel />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformancePanel metrics={metrics} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="settings">
            <ConfigurationPanel 
              config={config} 
              updateConfig={updateConfig} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
