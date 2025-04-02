
import { AlertTriangle } from "lucide-react";

interface MonitoringStateProps {
  threshold?: number;
  currentValue?: number;
  status?: "normal" | "warning" | "critical";
  message?: string;
}

/**
 * Component that displays monitoring information about system state
 * This provides the foundation for more advanced monitoring features
 */
export function MonitoringState({ 
  threshold = 100, 
  currentValue = 0, 
  status = "normal",
  message
}: MonitoringStateProps) {
  return (
    <div className="rounded-lg border p-4 flex items-center">
      {status === "warning" || status === "critical" ? (
        <AlertTriangle className={`h-5 w-5 mr-2 ${status === "critical" ? "text-red-500" : "text-amber-500"}`} />
      ) : null}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">System Status:</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            status === "normal" ? "bg-green-100 text-green-800" : 
            status === "warning" ? "bg-amber-100 text-amber-800" : 
            "bg-red-100 text-red-800"
          }`}>
            {status.toUpperCase()}
          </span>
        </div>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
        {currentValue !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Current: {currentValue}</span>
              <span>Threshold: {threshold}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  status === "normal" ? "bg-green-500" : 
                  status === "warning" ? "bg-amber-500" : 
                  "bg-red-500"
                }`}
                style={{ width: `${Math.min(100, (currentValue / threshold) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
