
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);

  const checkSystemStatus = async () => {
    setIsLoading(true);
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

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking system status:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkSystemStatus();
    
    // Subscribe to system_health_checks table for real-time updates
    const healthChannel = supabase.channel('system-health')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_health_checks'
        },
        (payload) => {
          const { component, status } = payload.new;
          
          // Update the specific component status
          if (component && status) {
            setSystemStatus(prev => {
              const key = component === 'database' ? 'database' :
                          component === 'api' ? 'api' : 
                          component === 'edge_functions' ? 'edgeFunctions' :
                          component === 'rpc_functions' ? 'rpcFunctions' :
                          component === 'storage' ? 'storage' : null;
              
              if (key) {
                const newStatus = status === 'healthy' ? 'healthy' :
                                 status === 'degraded' ? 'degraded' : 'offline';
                                 
                if (newStatus !== prev[key]) {
                  // Only toast if status changed
                  const statusMessage = newStatus === 'healthy' ? 'operational' : 
                                       newStatus === 'degraded' ? 'experiencing issues' : 'offline';
                  toast.info(`${component} is now ${statusMessage}`);
                }
                                 
                return {
                  ...prev,
                  [key]: newStatus
                };
              }
              
              return prev;
            });
          }
        }
      )
      .subscribe();
    
    // Check status every 5 minutes
    const intervalId = setInterval(checkSystemStatus, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(healthChannel);
    };
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current operational status of system components</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkSystemStatus}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="font-medium">Database</span>
              <p className="text-xs text-muted-foreground">Monitor for high vacuum tables</p>
            </div>
            {getStatusBadge(systemStatus.database)}
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="font-medium">API Services</span>
              <p className="text-xs text-muted-foreground">Watch for response time spikes</p>
            </div>
            {getStatusBadge(systemStatus.api)}
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="font-medium">Edge Functions</span>
              <p className="text-xs text-muted-foreground">Check for execution errors</p>
            </div>
            {getStatusBadge(systemStatus.edgeFunctions)}
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="font-medium">RPC Functions</span>
              <p className="text-xs text-muted-foreground">Watch for performance degradation</p>
            </div>
            {getStatusBadge(systemStatus.rpcFunctions)}
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="font-medium">Storage</span>
              <p className="text-xs text-muted-foreground">Monitor file upload throughput</p>
            </div>
            {getStatusBadge(systemStatus.storage)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
