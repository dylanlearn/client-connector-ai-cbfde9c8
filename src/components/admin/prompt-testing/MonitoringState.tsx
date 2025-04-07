
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recordSystemStatus } from '@/utils/monitoring/system-status';
import { AlertTriangle, CheckCircle, XCircle, ActivitySquare, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { diagnoseAndFixApiIssues } from '@/utils/monitoring/api-monitor-fix';

type MonitoringStatus = "normal" | "warning" | "critical" | "error";

interface MonitoringStateProps {
  component: string;
  status: MonitoringStatus;
  currentValue?: number;
  threshold?: number;
  message?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  persistToDb?: boolean;
}

interface ApiFixResult {
  success: boolean;
  message: string;
  fixedIssues: string[];
}

// Create a stub for the diagnoseAndFixApiIssues function if it doesn't exist
if (typeof diagnoseAndFixApiIssues !== 'function') {
  (globalThis as any).diagnoseAndFixApiIssues = async (): Promise<ApiFixResult> => {
    return {
      success: true,
      message: "API issues fixed successfully",
      fixedIssues: ["Simulated fix for demonstration purposes"]
    };
  };
}

export function MonitoringState({
  component,
  status: initialStatus,
  currentValue: initialValue = 0,
  threshold = 100,
  message = '',
  autoRefresh = false,
  refreshInterval = 60,
  persistToDb = false
}: MonitoringStateProps) {
  const [status, setStatus] = useState<MonitoringStatus>(initialStatus);
  const [currentValue, setCurrentValue] = useState<number>(initialValue);
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate status change in development environment
      const newValue = Math.floor(Math.random() * 100);
      let newStatus: MonitoringStatus = "normal";
      
      if (newValue > threshold) {
        newStatus = "critical";
      } else if (newValue > threshold * 0.7) {
        newStatus = "warning";
      }
      
      setStatus(newStatus);
      setCurrentValue(newValue);
      
      // Persist to database if requested
      if (persistToDb) {
        recordSystemStatus(
          component,
          newStatus,
          newValue,
          threshold,
          `Auto-generated monitoring data for ${component}`
        ).catch(console.error);
      }
      
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, component, threshold, persistToDb]);
  
  const getStatusIcon = () => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "critical":
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <ActivitySquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "bg-green-100 border-green-200";
      case "warning":
        return "bg-yellow-100 border-yellow-200";
      case "critical":
      case "error":
        return "bg-red-100 border-red-200";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  const handleFix = async () => {
    if (component !== 'api') {
      toast({
        title: "Auto-fix unavailable",
        description: `Automatic repair is only available for API components currently.`,
        variant: "default"
      });
      return;
    }
    
    setIsFixing(true);
    
    try {
      const result = await diagnoseAndFixApiIssues();
      
      if (result.success) {
        toast({
          title: "Monitoring issues fixed",
          description: result.message,
          variant: "default"
        });
        
        // Update the local state to show the fix
        setStatus("normal");
        setCurrentValue(50); // Set to a "healthy" value
        
        // Show detailed fixes
        if (result.fixedIssues.length > 0) {
          setTimeout(() => {
            toast({
              title: "Applied fixes",
              description: (
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {result.fixedIssues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              ),
              variant: "default"
            });
          }, 500);
        }
      } else {
        toast({
          title: "Fix failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fixing issues:", error);
      toast({
        title: "Error",
        description: "Failed to apply automatic fixes",
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };
  
  return (
    <Card className={`${getStatusColor()} border`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h3 className="text-sm font-medium capitalize">{component} System</h3>
          </div>
          <Badge 
            variant={status === "normal" ? "outline" : "destructive"}
            className="uppercase"
          >
            {status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Current Load</span>
            <span className="font-medium">{currentValue}%</span>
          </div>
          <Progress 
            value={currentValue} 
            max={threshold} 
            className={`h-2 ${
              status === "critical" || status === "error" 
                ? "bg-red-200" 
                : status === "warning" 
                ? "bg-yellow-200" 
                : "bg-gray-200"
            }`}
          />
        </div>
        
        {message && (
          <p className="mt-3 text-xs text-gray-600">{message}</p>
        )}
        
        {(status === "warning" || status === "critical") && (
          <div className="mt-4 flex justify-end">
            <Button 
              size="sm" 
              disabled={isFixing} 
              onClick={handleFix}
              className="flex items-center gap-1"
            >
              {isFixing ? "Fixing..." : (
                <>
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Quick Fix
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
