
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSystemStatus } from '@/utils/monitoring/system-status';
import { SystemStatus } from '@/utils/monitoring/system-status';
import SystemStatusDisplay from './SystemStatusDisplay';
import ApiUsageChart from './ApiUsageChart';

interface MonitoringDashboardProps {
  refreshInterval?: number;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ refreshInterval = 60000 }) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [apiUsage, setApiUsage] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('status');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getSystemStatus();
      setSystemStatus(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError('Failed to load system status data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // On component mount
  useEffect(() => {
    fetchSystemStatus();

    // Set up polling for refreshing data
    if (refreshInterval > 0) {
      const interval = setInterval(fetchSystemStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return (
    <div className="monitoring-dashboard space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Monitoring</h2>
          <p className="text-muted-foreground">Real-time metrics and status of system components.</p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <button 
            onClick={fetchSystemStatus}
            disabled={isLoading}
            className="flex items-center text-sm px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-center py-4">Loading system status...</div>}
              
              {!isLoading && systemStatus && (
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Overall System Status</h3>
                    <StatusBadge status={systemStatus.status} />
                  </div>
                  
                  <div className="grid gap-2">
                    {Object.entries(systemStatus.components).map(([name, component]) => (
                      <SystemStatusDisplay 
                        key={name}
                        name={name} 
                        status={component.status}
                        metrics={component.metrics}
                      />
                    ))}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Metrics</CardTitle>
              <CardDescription>Request volume and response times</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading API metrics...</div>
              ) : (
                <ApiUsageChart data={apiUsage} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Performance metrics visualization coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatusBadgeProps {
  status: 'operational' | 'degraded' | 'outage';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'outage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default MonitoringDashboard;
