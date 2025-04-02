
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MonitoringState } from "@/components/admin/prompt-testing/MonitoringState";
import { RateLimiterStatus } from "@/components/admin/monitoring/RateLimiterStatus";
import { ApiUsageMetrics } from "@/components/admin/monitoring/ApiUsageMetrics";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { recordSystemStatus } from "@/utils/monitoring-utils";

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

  // Fetch monitoring configurations
  useEffect(() => {
    const fetchMonitoringConfig = async () => {
      setIsLoading(true);
      
      try {
        // Use type assertion for tables not in TypeScript types
        const { data, error } = await (supabase
          .from('monitoring_configuration' as any)
          .select('*')
          .order('component')) as any;
          
        if (error) {
          throw error;
        }
        
        // If we have components, use them
        if (data && data.length > 0) {
          setMonitoringComponents(data);
        } else {
          // Otherwise, set some default components
          const defaultComponents = [
            { component: 'api', warning_threshold: 80, critical_threshold: 95, check_interval: 60, enabled: true },
            { component: 'database', warning_threshold: 70, critical_threshold: 90, check_interval: 120, enabled: true },
            { component: 'memory', warning_threshold: 75, critical_threshold: 90, check_interval: 60, enabled: true }
          ];
          
          setMonitoringComponents(defaultComponents);
          
          // Insert default components with type assertion
          await Promise.all(defaultComponents.map(component => 
            (supabase.from('monitoring_configuration' as any).upsert(component)) as any
          ));
          
          // Generate some initial data for these components
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMonitoringConfig();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">System Monitoring</h2>
      
      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="rate-limiting">Rate Limiting</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
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
      </Tabs>
    </Card>
  );
}
