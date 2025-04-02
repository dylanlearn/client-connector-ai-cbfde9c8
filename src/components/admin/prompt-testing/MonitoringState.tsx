
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMonitoringConfiguration, recordSystemStatus, SystemStatus } from "@/utils/monitoring-utils";

interface MonitoringStateProps {
  threshold?: number;
  currentValue?: number;
  status?: SystemStatus;
  message?: string;
  component?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  persistToDb?: boolean;
}

/**
 * Enhanced component that displays monitoring information about system state
 * Supports database persistence and auto-refresh
 */
export function MonitoringState({ 
  threshold = 100, 
  currentValue = 0, 
  status = "normal",
  message,
  component = "default",
  autoRefresh = false,
  refreshInterval = 30, // seconds
  persistToDb = false
}: MonitoringStateProps) {
  // State for dynamic values
  const [currentStatus, setCurrentStatus] = useState<SystemStatus>(status);
  const [currentThreshold, setCurrentThreshold] = useState<number>(threshold);
  const [currentValueState, setCurrentValueState] = useState<number>(currentValue);
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(message);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch configuration and latest status from database
  useEffect(() => {
    if (!component || !autoRefresh) return;

    const fetchMonitoringData = async () => {
      setIsLoading(true);
      
      try {
        // Get configuration for this component
        const config = await getMonitoringConfiguration(component);
        
        if (config) {
          setCurrentThreshold(config.critical_threshold);
          
          // Only update thresholds from config if available
          if (config.warning_threshold && config.critical_threshold) {
            // Determine status based on current value and thresholds
            let newStatus: SystemStatus = "normal";
            if (currentValueState >= config.critical_threshold) {
              newStatus = "critical";
            } else if (currentValueState >= config.warning_threshold) {
              newStatus = "warning";
            }
            
            if (newStatus !== currentStatus) {
              setCurrentStatus(newStatus);
              // Only show toast for status changes to warning or critical
              if (newStatus !== "normal") {
                toast[newStatus === "critical" ? "error" : "warning"](
                  `${component} status changed to ${newStatus.toUpperCase()}`,
                  { description: `Current value: ${currentValueState}, Threshold: ${newStatus === "critical" ? config.critical_threshold : config.warning_threshold}` }
                );
              }
            }
          }
        }
        
        // Get latest monitoring data for this component
        const { data, error } = await supabase
          .from('system_monitoring')
          .select('*')
          .eq('component', component)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching monitoring data:', error);
        } else if (data) {
          setCurrentValueState(data.value || 0);
          setCurrentStatus(data.status as SystemStatus);
          setCurrentMessage(data.message);
          setLastUpdated(new Date(data.created_at));
        }
      } catch (error) {
        console.error('Error in monitoring data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMonitoringData();
    
    // Set up interval for auto-refresh
    if (autoRefresh) {
      const intervalId = setInterval(fetchMonitoringData, refreshInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [component, autoRefresh, refreshInterval, currentValueState, currentStatus]);

  // Persist status to database if requested
  useEffect(() => {
    if (persistToDb && component) {
      recordSystemStatus(
        component,
        currentStatus,
        currentValueState,
        currentThreshold,
        currentMessage
      );
    }
  }, [persistToDb, component, currentStatus, currentValueState, currentThreshold, currentMessage]);

  // Get status icon based on current status
  const StatusIcon = () => {
    switch (currentStatus) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="rounded-lg border p-4 flex items-center">
      <StatusIcon />
      <div className="ml-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">System Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              currentStatus === "normal" ? "bg-green-100 text-green-800" : 
              currentStatus === "warning" ? "bg-amber-100 text-amber-800" : 
              "bg-red-100 text-red-800"
            }`}>
              {currentStatus.toUpperCase()}
            </span>
          </div>
          
          {isLoading && (
            <span className="text-xs text-muted-foreground">Refreshing...</span>
          )}
        </div>
        
        {currentMessage && <p className="text-sm text-muted-foreground mt-1">{currentMessage}</p>}
        
        {component && (
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">Component: {component}</span>
          </div>
        )}
        
        {currentValueState !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Current: {currentValueState}</span>
              <span>Threshold: {currentThreshold}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  currentStatus === "normal" ? "bg-green-500" : 
                  currentStatus === "warning" ? "bg-amber-500" : 
                  "bg-red-500"
                }`}
                style={{ width: `${Math.min(100, (currentValueState / currentThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
