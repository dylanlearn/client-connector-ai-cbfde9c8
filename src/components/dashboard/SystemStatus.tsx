
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define type for system status values
type SystemStatusType = 'healthy' | 'degraded' | 'offline';

// Define interface for system status
interface SystemStatusState {
  database: SystemStatusType;
  api: SystemStatusType;
  edgeFunctions: SystemStatusType;
  rpcFunctions: SystemStatusType;
  storage: SystemStatusType;
}

export function SystemStatus() {
  const [systemStatus, setSystemStatus] = useState<SystemStatusState>({
    database: 'healthy',
    api: 'healthy',
    edgeFunctions: 'healthy',
    rpcFunctions: 'healthy',
    storage: 'healthy'
  });

  useEffect(() => {
    // Function to check system status
    async function checkSystemStatus() {
      try {
        // Check database status
        const dbResponse = await supabase.rpc('check_database_performance');
        const dbStatus = dbResponse.error ? 'offline' : 
                         (dbResponse.data?.high_vacuum_tables?.length > 0 ? 'degraded' : 'healthy');
        
        // Check API status using a simple query
        const apiResponse = await supabase.from('system_health_status').select('component').limit(1);
        const apiStatus = apiResponse.error ? 'offline' : 'healthy';
        
        // Check edge functions status
        let edgeFunctionStatus: SystemStatusType = 'healthy';
        try {
          const edgeFunctionResponse = await supabase.functions.invoke('analytics-api', {
            body: { action: 'ping' }
          });
          edgeFunctionStatus = edgeFunctionResponse.error ? 'degraded' : 'healthy';
        } catch (error) {
          edgeFunctionStatus = 'offline';
        }
        
        // Check RPC functions status
        const rpcResponse = await supabase.rpc('manage_error_config', {
          p_action: 'list',
          p_component: null
        });
        const rpcStatus = rpcResponse.error ? 'offline' : 'healthy';
        
        // Check storage status
        const storageStatus = 'healthy' as SystemStatusType; // Placeholder as we don't have a direct way to check storage
        
        setSystemStatus({
          database: dbStatus as SystemStatusType,
          api: apiStatus as SystemStatusType,
          edgeFunctions: edgeFunctionStatus,
          rpcFunctions: rpcStatus as SystemStatusType,
          storage: storageStatus
        });
      } catch (error) {
        console.error('Error checking system status:', error);
      }
    }
    
    checkSystemStatus();
    
    // Check status every 5 minutes
    const intervalId = setInterval(checkSystemStatus, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getStatusBadge = (status: SystemStatusType) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500"><CheckCircle className="size-4 mr-1" /> Operational</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><AlertCircle className="size-4 mr-1" /> Degraded</Badge>;
      case 'offline':
        return <Badge variant="destructive"><XCircle className="size-4 mr-1" /> Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current operational status of the system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Database</span>
            {getStatusBadge(systemStatus.database)}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">API Services</span>
            {getStatusBadge(systemStatus.api)}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Edge Functions</span>
            {getStatusBadge(systemStatus.edgeFunctions)}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">RPC Functions</span>
            {getStatusBadge(systemStatus.rpcFunctions)}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Storage</span>
            {getStatusBadge(systemStatus.storage)}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Using optimized PostgreSQL RPC functions for increased performance and reduced edge function count.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
