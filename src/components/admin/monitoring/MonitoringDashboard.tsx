
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, Database, HardDrive, Cpu, Memory } from 'lucide-react';
import { StatusBadge } from './controls/StatusBadge';
import { AlertsPanel } from './panels/AlertsPanel';
import { ErrorsPanel } from './panels/ErrorsPanel';
import { PerformancePanel } from './panels/PerformancePanel';
import { ConfigurationPanel } from './panels/ConfigurationPanel';
import { supabase } from "@/integrations/supabase/client";
import { SystemHealthCheck } from '@/types/supabase-audit';
import { createRealtimeSubscription } from '@/utils/realtime-utils';

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<{
    api: SystemHealthCheck | null,
    database: SystemHealthCheck | null,
    storage: SystemHealthCheck | null,
    memory: SystemHealthCheck | null,
    cpu: SystemHealthCheck | null
  }>({
    api: null,
    database: null,
    storage: null,
    memory: null,
    cpu: null
  });

  // Function to map system health status to StatusBadge compatible status
  const mapSystemHealthToStatusType = (status: string | undefined): 'healthy' | 'warning' | 'critical' | 'unknown' => {
    if (!status) return 'unknown';
    
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
      case 'active':
      case 'good':
        return 'healthy';
      case 'degraded':
      case 'warning':
      case 'warn':
        return 'warning';
      case 'unhealthy':
      case 'error':
      case 'critical':
      case 'fail':
      case 'failed':
        return 'critical';
      default:
        return 'unknown';
    }
  };

  const fetchHealthData = async () => {
    setIsRefreshing(true);
    try {
      const { data: apiData, error: apiError } = await supabase
        .from('system_health_checks')
        .select('*')
        .eq('component', 'api')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: dbData, error: dbError } = await supabase
        .from('system_health_checks')
        .select('*')
        .eq('component', 'database')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: storageData, error: storageError } = await supabase
        .from('system_health_checks')
        .select('*')
        .eq('component', 'storage')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: memoryData, error: memoryError } = await supabase
        .from('system_health_checks')
        .select('*')
        .eq('component', 'memory')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: cpuData, error: cpuError } = await supabase
        .from('system_health_checks')
        .select('*')
        .eq('component', 'cpu')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setHealthData({
        api: apiData || null,
        database: dbData || null,
        storage: storageData || null,
        memory: memoryData || null,
        cpu: cpuData || null
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthData();

    // Set up realtime subscriptions for health check updates
    const apiSubscription = createRealtimeSubscription(
      'system-health-api',
      'system_health_checks',
      "component=eq.api",
      (payload) => {
        if (payload.new) {
          setHealthData(prev => ({...prev, api: payload.new}));
        }
      }
    );

    const dbSubscription = createRealtimeSubscription(
      'system-health-database',
      'system_health_checks',
      "component=eq.database",
      (payload) => {
        if (payload.new) {
          setHealthData(prev => ({...prev, database: payload.new}));
        }
      }
    );

    const storageSubscription = createRealtimeSubscription(
      'system-health-storage',
      'system_health_checks',
      "component=eq.storage",
      (payload) => {
        if (payload.new) {
          setHealthData(prev => ({...prev, storage: payload.new}));
        }
      }
    );

    const memorySubscription = createRealtimeSubscription(
      'system-health-memory',
      'system_health_checks',
      "component=eq.memory",
      (payload) => {
        if (payload.new) {
          setHealthData(prev => ({...prev, memory: payload.new}));
        }
      }
    );

    const cpuSubscription = createRealtimeSubscription(
      'system-health-cpu',
      'system_health_checks',
      "component=eq.cpu",
      (payload) => {
        if (payload.new) {
          setHealthData(prev => ({...prev, cpu: payload.new}));
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      apiSubscription.unsubscribe();
      dbSubscription.unsubscribe();
      storageSubscription.unsubscribe();
      memorySubscription.unsubscribe();
      cpuSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">System Monitoring Dashboard</h2>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={fetchHealthData} 
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              API
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge 
                  status={mapSystemHealthToStatusType(healthData.api?.status)}
                />
                <span className="text-xs text-gray-500">
                  {healthData.api?.response_time_ms ? `${healthData.api.response_time_ms}ms` : '---'}
                </span>
              </div>
            )}
            <p className="text-xs mt-2 text-gray-500">Monitor for sudden API response time increases or errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-500" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge 
                  status={mapSystemHealthToStatusType(healthData.database?.status)} 
                />
                <span className="text-xs text-gray-500">
                  {healthData.database?.response_time_ms ? `${healthData.database.response_time_ms}ms` : '---'}
                </span>
              </div>
            )}
            <p className="text-xs mt-2 text-gray-500">Watch for connection issues or slow query performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-green-500" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge 
                  status={mapSystemHealthToStatusType(healthData.storage?.status)} 
                />
                <span className="text-xs text-gray-500">
                  {healthData.storage?.response_time_ms ? `${healthData.storage.response_time_ms}ms` : '---'}
                </span>
              </div>
            )}
            <p className="text-xs mt-2 text-gray-500">Check for storage availability and upload/download issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Memory className="h-4 w-4 text-yellow-500" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge 
                  status={mapSystemHealthToStatusType(healthData.memory?.status)} 
                />
                <span className="text-xs text-gray-500">
                  {healthData.memory?.response_time_ms ? `${healthData.memory.response_time_ms}ms` : '---'}
                </span>
              </div>
            )}
            <p className="text-xs mt-2 text-gray-500">Track memory usage to prevent resource exhaustion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="h-4 w-4 text-red-500" />
              CPU
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge 
                  status={mapSystemHealthToStatusType(healthData.cpu?.status)} 
                />
                <span className="text-xs text-gray-500">
                  {healthData.cpu?.response_time_ms ? `${healthData.cpu.response_time_ms}ms` : '---'}
                </span>
              </div>
            )}
            <p className="text-xs mt-2 text-gray-500">Monitor CPU spikes that may indicate processing bottlenecks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Real-time status of all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  System monitoring active. View real-time health status of all components above.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>
          
          <TabsContent value="errors">
            <ErrorsPanel />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformancePanel />
          </TabsContent>
          
          <TabsContent value="configuration">
            <ConfigurationPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
