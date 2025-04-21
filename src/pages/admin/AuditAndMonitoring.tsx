
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSystemStatus } from '@/utils/monitoring/system-status';
import MonitoringDashboard from '@/components/admin/monitoring/MonitoringDashboard';

export function AuditAndMonitoring() {
  const [systemData, setSystemData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchSystemData = async () => {
    try {
      setIsRefreshing(true);
      const data = await getSystemStatus();
      // Convert system status format to match expected format
      const convertedData = {
        status: mapSystemStatusToGeneral(data.status),
        components: Object.entries(data.components).reduce((acc, [key, component]) => {
          return {
            ...acc,
            [key]: {
              ...component,
              status: mapSystemStatusToGeneral(component.status)
            }
          };
        }, {}),
        lastUpdated: data.lastUpdated
      };
      
      setSystemData(convertedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching system data:', err);
      setError('Failed to load system data');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };
  
  // Map operational/degraded/outage to the expected status values
  const mapSystemStatusToGeneral = (status: 'operational' | 'degraded' | 'outage'): string => {
    switch(status) {
      case 'operational': return 'healthy';
      case 'degraded': return 'degraded';
      case 'outage': return 'error';
      default: return 'unknown';
    }
  };
  
  useEffect(() => {
    fetchSystemData();
  }, []);
  
  const handleRefresh = () => {
    fetchSystemData();
  };
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // In a real app, you would refetch data with the new period
  };
  
  const handleConfigUpdate = async () => {
    // Placeholder for configuration update logic
    console.log('Configuration updated');
    await fetchSystemData();
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit & Monitoring</h1>
        <p className="text-muted-foreground">Monitor system health and review audit logs</p>
      </div>
      
      <Tabs defaultValue="monitoring">
        <TabsList>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitoring" className="space-y-4 mt-4">
          <MonitoringDashboard />
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Review system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Audit log interface will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Configuration</CardTitle>
              <CardDescription>Configure monitoring settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Services</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <p className="font-medium">Redis Connection</p>
                        <p className="text-sm text-muted-foreground">Background job processing</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                        <span>Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Alert Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure when and how to send system alerts
                  </p>
                  <button 
                    onClick={handleConfigUpdate}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Update Configuration
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AuditAndMonitoring;
