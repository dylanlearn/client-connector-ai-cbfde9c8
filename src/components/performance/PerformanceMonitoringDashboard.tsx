
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetOptimizationService } from '@/services/AssetOptimizationService';

export const PerformanceMonitoringDashboard = () => {
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week'>('hour');
  
  // Get performance metrics
  const { data: performanceMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['performance-metrics', timeframe],
    queryFn: async () => {
      let timeFilter;
      
      switch(timeframe) {
        case 'hour':
          timeFilter = 'now() - interval \'1 hour\'';
          break;
        case 'day':
          timeFilter = 'now() - interval \'1 day\'';
          break;
        case 'week':
          timeFilter = 'now() - interval \'7 days\'';
          break;
      }
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .gt('timestamp', timeFilter)
        .order('timestamp', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });
  
  // Get asset optimization stats
  const { data: optimizationStats, isLoading: statsLoading } = useQuery({
    queryKey: ['optimization-stats'],
    queryFn: async () => {
      return await AssetOptimizationService.getOptimizationStats();
    }
  });
  
  // Get performance alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['performance-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_alerts')
        .select(`
          *,
          performance_metrics!metric_id(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    }
  });

  // Process metrics for charts
  const processMetricsForCharts = () => {
    if (!performanceMetrics) return {};
    
    // Group by metric name and type
    const renderTimes = performanceMetrics.filter(m => m.metric_type === 'render' && m.metric_name === 'wireframe_render_time');
    const fpsList = performanceMetrics.filter(m => m.metric_type === 'render' && m.metric_name === 'fps');
    const interactionDelays = performanceMetrics.filter(m => m.metric_type === 'interaction' && m.metric_name === 'interaction_delay');
    const memoryUsage = performanceMetrics.filter(m => m.metric_type === 'memory' && m.metric_name === 'js_heap_size');

    // Format the data for charts
    const formatData = (metrics, valueKey = 'value') => {
      return metrics.map(m => ({
        timestamp: new Date(m.timestamp).toLocaleTimeString(),
        [valueKey]: m.value,
        ...(m.context ? { context: m.context } : {})
      }));
    };
    
    return {
      renderTimes: formatData(renderTimes, 'render_time'),
      fpsList: formatData(fpsList, 'fps'),
      interactionDelays: formatData(interactionDelays, 'delay'),
      memoryUsage: formatData(memoryUsage, 'memory_mb')
    };
  };
  
  const chartData = processMetricsForCharts();
  
  // Format asset optimization data for charts
  const optimizationChartData = optimizationStats?.map(stat => ({
    type: stat.asset_type,
    count: stat.total_count,
    originalSize: Math.round(stat.total_original_size / 1024), // KB
    optimizedSize: Math.round(stat.total_optimized_size / 1024), // KB
    compressionRatio: Math.round(stat.average_compression * 100)
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Performance Monitoring</h2>
        <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
          <TabsList>
            <TabsTrigger value="hour">Last Hour</TabsTrigger>
            <TabsTrigger value="day">Last Day</TabsTrigger>
            <TabsTrigger value="week">Last Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Render Time Card */}
        <Card>
          <CardHeader>
            <CardTitle>Wireframe Render Time</CardTitle>
            <CardDescription>Time taken to render wireframes (ms)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {metricsLoading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.renderTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="render_time" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* FPS Card */}
        <Card>
          <CardHeader>
            <CardTitle>Frames Per Second</CardTitle>
            <CardDescription>Rendering performance in FPS</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {metricsLoading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.fpsList}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis domain={[0, 'dataMax']} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="fps" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Interaction Delay Card */}
        <Card>
          <CardHeader>
            <CardTitle>Interaction Delays</CardTitle>
            <CardDescription>Response time for user interactions (ms)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {metricsLoading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.interactionDelays}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="delay" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Memory Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>JavaScript heap size (MB)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {metricsLoading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.memoryUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="memory_mb" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Asset Optimization Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Optimization</CardTitle>
          <CardDescription>Size reduction and compression statistics</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {statsLoading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={optimizationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Original Size (KB)" dataKey="originalSize" fill="#8884d8" />
                <Bar name="Optimized Size (KB)" dataKey="optimizedSize" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Alerts Card */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Alerts</CardTitle>
          <CardDescription>Recent performance issues</CardDescription>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="flex items-center justify-center h-16">Loading...</div>
          ) : alerts?.length ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-md ${
                    alert.alert_type === 'critical' ? 'bg-red-50 border-red-200' : 
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="font-medium">
                    {alert.alert_type === 'critical' ? '🔴 Critical' : '⚠️ Warning'}: {alert.message}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-muted-foreground">
                      {alert.actual_value} {alert.performance_metrics?.unit} 
                      {' '} (threshold: {alert.threshold_value} {alert.performance_metrics?.unit})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No performance alerts found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitoringDashboard;
