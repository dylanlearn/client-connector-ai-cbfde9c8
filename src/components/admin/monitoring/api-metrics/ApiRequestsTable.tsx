
import { Skeleton } from "@/components/ui/skeleton";

interface ApiMetric {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  request_timestamp: string;
  user_id?: string;
  ip_address?: string;
  error_message?: string;
  request_payload?: any;
}

interface ApiRequestsTableProps {
  metrics: ApiMetric[];
  isLoading: boolean;
}

export function ApiRequestsTable({ metrics, isLoading }: ApiRequestsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  
  if (metrics.length === 0) {
    return <p className="text-sm text-muted-foreground">No API usage data available</p>;
  }
  
  return (
    <div className="text-xs max-h-60 overflow-y-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-2">Endpoint</th>
            <th className="text-left pb-2">Method</th>
            <th className="text-right pb-2">Status</th>
            <th className="text-right pb-2">Time (ms)</th>
            <th className="text-right pb-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.id} className="border-b border-gray-100">
              <td className="py-1 max-w-[150px] truncate">{metric.endpoint}</td>
              <td className="py-1">{metric.method}</td>
              <td className={`py-1 text-right ${
                metric.status_code >= 200 && metric.status_code < 300 ? 'text-green-600' :
                metric.status_code >= 400 && metric.status_code < 500 ? 'text-amber-600' :
                metric.status_code >= 500 ? 'text-red-600' : ''
              }`}>{metric.status_code}</td>
              <td className="py-1 text-right">{metric.response_time_ms}</td>
              <td className="py-1 text-right">
                {new Date(metric.request_timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
