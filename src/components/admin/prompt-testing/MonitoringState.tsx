
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from '@/components/ui/gauge';
import { toast } from 'sonner';
import { recordSystemStatus, SystemStatus, getMonitoringConfiguration } from '@/utils/monitoring/system-status';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface MonitoringStateProps {
  component: string;
  threshold: number;
  status: SystemStatus;
  currentValue?: number;
  message?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  persistToDb?: boolean;
}

export function MonitoringState({
  component,
  threshold,
  status: initialStatus,
  currentValue: initialValue = 0,
  message,
  autoRefresh = false,
  refreshInterval = 60,
  persistToDb = false,
}: MonitoringStateProps) {
  const [status, setStatus] = useState<SystemStatus>(initialStatus);
  const [currentValue, setCurrentValue] = useState<number>(initialValue);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState<number>(threshold * 0.8);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Simulate a monitoring refresh
  const refreshMonitoring = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Get monitoring configuration if available
      const config = persistToDb ? await getMonitoringConfiguration(component) : null;
      
      // If we have a config, use those thresholds
      if (config) {
        setWarningThreshold(config.warning_threshold);
      }
      
      // Generate a simulated value (in real app, this would be fetching real metrics)
      const value = Math.floor(Math.random() * 100);
      let newStatus: SystemStatus;
      
      if (value >= threshold) {
        newStatus = 'critical';
      } else if (value >= warningThreshold) {
        newStatus = 'warning';
      } else {
        newStatus = 'normal';
      }
      
      // Update state
      setCurrentValue(value);
      setStatus(newStatus);
      
      // Persist to database if needed
      if (persistToDb) {
        await recordSystemStatus(
          component,
          newStatus,
          value,
          threshold,
          `${component} monitoring status: ${newStatus}`
        );
      }
    } catch (error: any) {
      console.error('Error refreshing monitoring:', error);
      setError(error.message || 'Failed to refresh monitoring data');
    } finally {
      setIsRefreshing(false);
    }
  }, [component, threshold, persistToDb, warningThreshold]);

  // Set up automatic refresh
  useEffect(() => {
    if (autoRefresh) {
      refreshMonitoring();
      
      const interval = window.setInterval(() => {
        refreshMonitoring();
      }, refreshInterval * 1000);
      
      intervalRef.current = interval;
      
      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshMonitoring]);

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'normal':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Calculate gauge color
  const gaugeColor = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>{component.charAt(0).toUpperCase() + component.slice(1)} Status</span>
          <StatusBadge status={status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Gauge value={currentValue} max={100} size={80} color={gaugeColor} />
          <div className="space-y-1 ml-4 flex-1">
            <p className="text-sm text-muted-foreground">
              {message || `${component} utilization is at ${currentValue}%`}
            </p>
            {error && (
              <p className="text-xs text-red-500">Error: {error}</p>
            )}
          </div>
          {autoRefresh ? (
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Auto-refreshes every {refreshInterval}s
            </div>
          ) : (
            <button 
              onClick={refreshMonitoring} 
              disabled={isRefreshing}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
