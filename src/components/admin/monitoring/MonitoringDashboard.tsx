import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MonitoringState } from "@/components/admin/prompt-testing/MonitoringState";
import { RateLimiterStatus } from "@/components/admin/monitoring/RateLimiterStatus";
import { ApiUsageMetrics } from "@/components/admin/monitoring/ApiUsageMetrics";
import { MonitoringControls } from "@/components/admin/monitoring/MonitoringControls";
import { ClientErrorMonitoring } from "@/components/admin/monitoring/ClientErrorMonitoring";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { recordSystemStatus } from "@/utils/monitoring/system-status";
import { MonitoringConfiguration } from "@/utils/monitoring/types";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";
import { ProfileQueryMonitor } from "./ProfileQueryMonitor";

interface MonitoringComponentConfig {
  component: string;
  warning_threshold: number;
  critical_threshold: number;
  check_interval: number;
  enabled: boolean;
}

export function MonitoringDashboard() {
  const [monitoringComponents, setMonitoringComponents] = useState<MonitoringComponentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, isVerifying } = useAdminStatus();
  const { toast } = useToast();

  const fetchMonitoringConfig = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('monitoring_configuration')
        .select('*')
        .order('component');
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setMonitoringComponents(data);
      } else {
        const defaultComponents = [
          { component: 'api', warning_threshold: 80, critical_threshold: 95, check_interval: 60, enabled: true },
          { component: 'database', warning_threshold: 70, critical_threshold: 90, check_interval: 120, enabled: true },
          { component: 'memory', warning_threshold: 75, critical_threshold: 90, check_interval: 60, enabled: true }
        ];
        
        setMonitoringComponents(defaultComponents);
        
        await Promise.all(defaultComponents.map(component => 
          supabase.from('monitoring_configuration').upsert(component)
        ));
        
        await Promise.all(defaultComponents.map(component => {
          const value = Math.floor(Math.random() * component.warning_threshold);
          const status = value < component.warning_threshold ? "normal" : 
                          value < component.critical_threshold ? "warning" : "critical";
                          
          return recordSystemStatus(
            component.component,
            status,
            value,
            component.critical_threshold,
            `Initial ${component.component} monitoring data`
          );
        }));
      }
    } catch (error) {
      console.error('Error fetching monitoring configuration:', error);
      toast({
        title: "Error loading monitoring data",
        description: "There was a problem fetching the monitoring configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringConfig();
  }, []);

  if (isVerifying) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Verifying admin access...</p>
        </div>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You need administrator privileges to access the system monitoring dashboard.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">System Monitoring</h2>
      
      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="rate-limiting">Rate Limiting</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
          <TabsTrigger value="errors">Client Errors</TabsTrigger>
          <TabsTrigger value="profiles">Profile Queries</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <p>Loading monitoring components...</p>
            ) : (
              monitoringComponents.map((component) => (
                <MonitoringState
                  key={component.component}
                  component={component.component}
                  threshold={component.critical_threshold}
                  status="normal"
                  currentValue={Math.floor(Math.random() * component.warning_threshold)}
                  message={`Monitoring ${component.component} system component`}
                  autoRefresh={true}
                  refreshInterval={component.check_interval}
                  persistToDb={true}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rate-limiting">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RateLimiterStatus endpoint="all" refreshInterval={30} />
            <RateLimiterStatus endpoint="api" refreshInterval={30} />
          </div>
        </TabsContent>
        
        <TabsContent value="api-usage">
          <ApiUsageMetrics refreshInterval={30} limit={20} />
        </TabsContent>
        
        <TabsContent value="errors">
          <ClientErrorMonitoring />
        </TabsContent>
        
        <TabsContent value="profiles">
          <ProfileQueryMonitor />
        </TabsContent>
        
        <TabsContent value="settings">
          <MonitoringControls onConfigUpdate={fetchMonitoringConfig} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
