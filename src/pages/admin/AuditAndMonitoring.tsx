import React, { useState, useEffect } from 'react';
import { ConfigurationPanel } from '@/components/admin/monitoring/panels/ConfigurationPanel';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/admin/monitoring/controls/StatusBadge';
import { getSystemStatus, getSystemMetrics } from '@/utils/monitoring/system-status';
import { getApiMetrics } from '@/utils/monitoring/api-usage';
import { SystemStatus } from '@/utils/monitoring/types';
import { 
  Activity, 
  Database, 
  Server, 
  HardDrive, 
  RefreshCcw, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { generateMonitoringData, clearMonitoringData } from '@/services/monitoring-service';
import { toast } from 'sonner';

export default function AuditAndMonitoring() {
  const [redisConnected, setRedisConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'week'>('day');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [apiMetrics, setApiMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  
  useEffect(() => {
    fetchAllData();
    
    // Set up auto-refresh if enabled
    let intervalId: number | undefined;
    if (autoRefresh) {
      intervalId = window.setInterval(() => {
        fetchAllData();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, selectedPeriod]);
  
  const fetchAllData = async () => {
    try {
      setIsRefreshing(true);
      
      // Fetch system status
      const status = await getSystemStatus();
      setSystemStatus(status);
      
      // Fetch system metrics
      const metrics = await getSystemMetrics();
      setSystemMetrics(metrics);
      
      // Fetch API metrics
      const apiData = await getApiMetrics(selectedPeriod);
      setApiMetrics(apiData);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      toast.error('Failed to fetch monitoring data');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleSaveChanges = async () => {
    // Implementation for saving changes
    toast.success('Configuration saved successfully');
    return Promise.resolve();
  };
  
  const handleRefresh = () => {
    fetchAllData();
  };
  
  const handleGenerateData = async () => {
    setIsGeneratingData(true);
    try {
      const success = await generateMonitoringData();
      if (success) {
        fetchAllData();
      }
    } finally {
      setIsGeneratingData(false);
    }
  };
  
  const handleClearData = async () => {
    setIsClearingData(true);
    try {
      await clearMonitoringData();
      fetchAllData();
    } finally {
      setIsClearingData(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">System Audit & Monitoring</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateData}
              disabled={isGeneratingData}
            >
              {isGeneratingData ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Test Data'
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearData}
              disabled={isClearingData}
            >
              {isClearingData ? 'Clearing...' : 'Clear Test Data'}
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {systemStatus && Object.entries(systemStatus.components).map(([key, component]) => (
                <Card key={key}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {key} Status
                    </CardTitle>
                    <StatusBadge status={component.status} showText />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(component.metrics).map(([metricKey, value]) => (
                        <div key={metricKey} className="flex justify-between py-1">
                          <span className="capitalize">{metricKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium text-foreground">{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 border-t mt-2 pt-2">
                        <span>Last Updated</span>
                        <span className="font-medium text-foreground">
                          {new Date(component.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    CPU & Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {systemMetrics && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">CPU</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Usage</div>
                            <div className="text-xl font-bold">{systemMetrics.cpu.usage}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Temperature</div>
                            <div className="text-xl font-bold">{systemMetrics.cpu.temperature}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Processes</div>
                            <div className="text-xl font-bold">{systemMetrics.cpu.processes}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Memory</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Used</div>
                            <div className="text-xl font-bold">{systemMetrics.memory.used}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Total</div>
                            <div className="text-xl font-bold">{systemMetrics.memory.total}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Percentage</div>
                            <div className="text-xl font-bold">{systemMetrics.memory.percentage}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-2" />
                    Storage & Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {systemMetrics && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Storage</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Read</div>
                            <div className="text-xl font-bold">{systemMetrics.storage.read}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Write</div>
                            <div className="text-xl font-bold">{systemMetrics.storage.write}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">IO Wait</div>
                            <div className="text-xl font-bold">{systemMetrics.storage.ioWait}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Network</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Inbound</div>
                            <div className="text-xl font-bold">{systemMetrics.network.inbound}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Outbound</div>
                            <div className="text-xl font-bold">{systemMetrics.network.outbound}</div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="text-xs text-muted-foreground">Connections</div>
                            <div className="text-xl font-bold">{systemMetrics.network.activeConnections}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    API Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {apiMetrics && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">Total Requests</div>
                          <div className="text-xl font-bold">{apiMetrics.totalRequests}</div>
                        </div>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">Avg Response Time</div>
                          <div className="text-xl font-bold">{apiMetrics.averageResponseTime}ms</div>
                        </div>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">Error Rate</div>
                          <div className="text-xl font-bold">{apiMetrics.errorRate}%</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Top Endpoints</h4>
                        <div className="space-y-2">
                          {apiMetrics.topEndpoints.map((endpoint: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                              <span className="text-xs font-mono">{endpoint.endpoint}</span>
                              <span className="text-xs font-medium">{endpoint.requests} requests</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    API Health Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Authentication API</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">Operational</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">User Management API</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">Operational</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Content API</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">Operational</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">Analytics API</span>
                      </div>
                      <span className="text-xs font-medium text-red-500">Degraded</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Storage API</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">Operational</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="database">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Connection Pool</div>
                        <div className="text-xl font-bold">12/20</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Active Queries</div>
                        <div className="text-xl font-bold">8</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Avg Query Time</div>
                        <div className="text-xl font-bold">45ms</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Cache Hit Ratio</div>
                        <div className="text-xl font-bold">92%</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Recent Slow Queries</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-muted rounded-md">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">SELECT * FROM large_table WHERE...</span>
                            <span>2.3s</span>
                          </div>
                        </div>
                        <div className="p-2 bg-muted rounded-md">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">JOIN operation on users and profiles</span>
                            <span>1.8s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Redis Cache Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Memory Usage</div>
                        <div className="text-xl font-bold">24MB</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Connected Clients</div>
                        <div className="text-xl font-bold">8</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Hit Rate</div>
                        <div className="text-xl font-bold">98.5%</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-xs text-muted-foreground">Ops/sec</div>
                        <div className="text-xl font-bold">1,245</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Cache Keys</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-muted rounded-md">
                          <span className="text-xs">user:profile:*</span>
                          <span className="text-xs font-medium">1,245 keys</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded-md">
                          <span className="text-xs">session:*</span>
                          <span className="text-xs font-medium">842 keys</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded-md">
                          <span className="text-xs">api:rate-limit:*</span>
                          <span className="text-xs font-medium">156 keys</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="config">
            <ConfigurationPanel 
              redisConnected={redisConnected} 
              onSaveChanges={handleSaveChanges}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              autoRefresh={autoRefresh}
              onAutoRefreshToggle={setAutoRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
