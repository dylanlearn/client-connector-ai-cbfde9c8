
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiMetricsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function ApiMetricsHeader({ onRefresh, isLoading }: ApiMetricsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Activity className="h-5 w-5 mr-2 text-primary" />
        <h3 className="font-medium">API Usage Metrics</h3>
      </div>
      
      <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
        <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
