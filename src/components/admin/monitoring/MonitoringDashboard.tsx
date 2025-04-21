
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "./controls/StatusBadge";
import { PerformancePanel } from "./panels/PerformancePanel";
import { AlertsPanel } from "./panels/AlertsPanel";
import { ErrorsPanel } from "./panels/ErrorsPanel";
import { ConfigurationPanel } from "./panels/ConfigurationPanel";
import { Activity, AlertCircle, MemoryStick, Settings } from "lucide-react";

export function MonitoringDashboard() {
  const [systemStatus] = useState<Record<string, string>>({
    api: "healthy",
    database: "healthy",
    memory: "warning",
    storage: "healthy",
    functions: "healthy",
  });
  
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
        return "critical";
      default:
        return "unknown";
    }
  };

  const getSystemOverallStatus = (): "healthy" | "warning" | "critical" | "unknown" => {
    if (Object.values(systemStatus).some(s => s === "error" || s === "unhealthy")) {
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

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          System Status
          <StatusBadge status={getSystemOverallStatus()} className="ml-2" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-2" />
              <span>API</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.api)} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-indigo-500 mr-2" />
              <span>Functions</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.functions)} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <MemoryStick className="h-5 w-5 text-yellow-500 mr-2" />
              <span>Memory</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.memory)} />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Database</span>
            </div>
            <StatusBadge status={mapSystemHealthToStatusType(systemStatus.database)} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="performance">
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
