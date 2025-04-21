
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "./controls/StatusBadge";
import { PerformancePanel } from "./panels/PerformancePanel";
import { AlertsPanel } from "./panels/AlertsPanel";
import { ErrorsPanel } from "./panels/ErrorsPanel";
import { ConfigurationPanel } from "./panels/ConfigurationPanel";
import { Activity, AlertCircle, MemoryStick, Settings, Database, HardDrive } from "lucide-react";
import { toast } from "sonner";
import { getSystemStatus } from "@/utils/monitoring/system-status";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function MonitoringDashboard() {
  const [systemStatus, setSystemStatus] = useState<Record<string, string>>({
    api: "healthy",
    database: "healthy",
    memory: "warning",
    storage: "healthy",
    functions: "healthy",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("performance");
  
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setIsLoading(true);
        const status = await getSystemStatus();
        
        // Extract component statuses from the response
        const componentStatuses: Record<string, string> = {};
        Object.entries(status.components).forEach(([key, value]) => {
          componentStatuses[key] = value.status;
        });
        
        setSystemStatus(componentStatuses);
      } catch (error) {
        console.error("Failed to fetch system status:", error);
        toast.error("Failed to load monitoring data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSystemStatus();
    
    // Set up polling interval for regular updates (every 30 seconds)
    const intervalId = setInterval(fetchSystemStatus, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Helper function to map system health statuses to StatusBadge types
  const mapSystemHealthToStatusType = (status: string): "healthy" | "warning" | "critical" | "unknown" => {
    switch(status.toLowerCase()) {
      case "healthy":
      case "ok":
        return "healthy";
      case "warning":
      case "degraded":
        return "warning";
      case "error":
      case "unhealthy":
      case "critical":
        return "critical";
      default:
        return "unknown";
    }
  };

  const getSystemOverallStatus = (): "healthy" | "warning" | "critical" | "unknown" => {
    if (Object.values(systemStatus).some(s => s === "error" || s === "unhealthy" || s === "critical")) {
      return "critical";
    }
    if (Object.values(systemStatus).some(s => s === "warning" || s === "degraded")) {
      return "warning";
    }
    if (Object.values(systemStatus).every(s => s === "healthy" || s === "ok")) {
      return "healthy";
    }
    return "unknown";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-muted-foreground">Loading system status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          System Status
          <StatusBadge status={getSystemOverallStatus()} showText={true} />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-2" />
              <span>API</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.api || 'unknown')} showText={true} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-indigo-500 mr-2" />
              <span>Database</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.database || 'unknown')} showText={true} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <MemoryStick className="h-5 w-5 text-yellow-500 mr-2" />
              <span>Memory</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.memory || 'unknown')} showText={true} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <HardDrive className="h-5 w-5 text-green-500 mr-2" />
              <span>Storage</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.storage || 'unknown')} showText={true} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-purple-500 mr-2" />
              <span>Functions</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.functions || 'unknown')} showText={true} />
          </div>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <PerformancePanel />
        </TabsContent>
        
        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
        
        <TabsContent value="errors">
          <ErrorsPanel />
        </TabsContent>
        
        <TabsContent value="configuration">
          <ConfigurationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MonitoringDashboard;
