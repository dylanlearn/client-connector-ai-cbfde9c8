
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationPanel } from './panels/ConfigurationPanel';
import { ErrorsPanel } from './panels/ErrorsPanel';
import { PerformancePanel } from './panels/PerformancePanel';
import { AlertsPanel } from './panels/AlertsPanel';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { StatusBadge } from './controls/StatusBadge';
import { AlertCircle } from 'lucide-react';

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = React.useState('configuration');

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
          <div className="flex items-center justify-between">
            <StatusBadge status="healthy" />
            <span className="text-sm text-muted-foreground">100%</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">Database</div>
          <div className="flex items-center justify-between">
            <StatusBadge status="healthy" />
            <span className="text-sm text-muted-foreground">98%</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">Cache</div>
          <div className="flex items-center justify-between">
            <StatusBadge status="warning" />
            <span className="text-sm text-muted-foreground">85%</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-sm font-medium mb-2">Storage</div>
          <div className="flex items-center justify-between">
            <StatusBadge status="healthy" />
            <span className="text-sm text-muted-foreground">99%</span>
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
