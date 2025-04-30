
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PerformanceMonitoringService } from '@/services/PerformanceMonitoringService';
import { useFpsMonitor } from '@/hooks/useFpsMonitor';

const PerformanceMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const fps = useFpsMonitor({ enabled: true });
  
  useEffect(() => {
    // Initialize metrics collection
    const monitoringService = PerformanceMonitoringService.getInstance();
    
    // Update metrics every second
    const intervalId = setInterval(() => {
      const currentMetrics = monitoringService.getMetrics();
      setMetrics(currentMetrics);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Process metrics for visualization
  const fpsData = metrics
    .filter(metric => metric.type === 'fps')
    .slice(-30) // Last 30 FPS readings
    .map((metric, index) => ({
      name: index,
      value: metric.data.value
    }));
    
  const renderTimeData = metrics
    .filter(metric => metric.type === 'wireframeRender')
    .slice(-20) // Last 20 render events
    .map((metric, index) => ({
      name: index,
      value: metric.data.renderTimeMs
    }));
  
  const interactionData = metrics
    .filter(metric => metric.type === 'interaction')
    .slice(-20) // Last 20 interaction events
    .map((metric, index) => ({
      name: index,
      value: metric.data.delayMs
    }));

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rendering">Rendering</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current FPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fps || 'N/A'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Frames per second
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Render Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {renderTimeData.length > 0 
                    ? Math.round(renderTimeData.reduce((acc, curr) => acc + curr.value, 0) / renderTimeData.length) 
                    : 'N/A'} ms
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average wireframe render time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Interaction Delay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {interactionData.length > 0 
                    ? Math.round(interactionData.reduce((acc, curr) => acc + curr.value, 0) / interactionData.length) 
                    : 'N/A'} ms
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average interaction response time
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>FPS Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fpsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'dataMax + 10']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rendering" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Render Time by Component</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={renderTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'dataMax + 10']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2196f3" 
                    strokeWidth={2} 
                    dot={true} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Memory usage data will appear here once the application has collected enough metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitoringDashboard;
