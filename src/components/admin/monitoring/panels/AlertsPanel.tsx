
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bell, BellOff, CheckCircle } from 'lucide-react';
import { MonitoringAlertConfig } from '@/utils/monitoring/types';

interface Alert {
  id: string;
  component: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertConfigs, setAlertConfigs] = useState<MonitoringAlertConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch active alerts
        const { data: alertsData } = await supabase
          .from('system_alerts')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
          
        // Fetch alert configurations
        const { data: configsData } = await supabase
          .from('monitoring_alert_config')
          .select('*');
          
        setAlerts(alertsData || []);
        setAlertConfigs(configsData || []);
      } catch (error) {
        console.error('Error fetching alerts data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const acknowledgeAlert = async (id: string) => {
    try {
      await supabase
        .from('system_alerts')
        .update({ acknowledged: true })
        .eq('id', id);
        
      // Update local state
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const toggleAlertConfig = async (id: string, enabled: boolean) => {
    try {
      await supabase
        .from('monitoring_alert_config')
        .update({ enabled: !enabled })
        .eq('id', id);
        
      // Update local state
      setAlertConfigs(alertConfigs.map(config => 
        config.id === id ? { ...config, enabled: !enabled } : config
      ));
    } catch (error) {
      console.error('Error updating alert configuration:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-6 w-6 border-b-2 border-primary mx-auto mb-2 rounded-full"></div>
              <p className="text-muted-foreground">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-8 text-center border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">No active alerts</p>
              <p className="text-muted-foreground text-sm">All systems are operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-4 border rounded-lg ${
                  alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className={alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} size={16} />
                        <h4 className="font-medium">
                          {alert.component} - {alert.metric}
                        </h4>
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">
                        Value: <span className="font-medium">{alert.value}</span> 
                        {' '}&gt;{' '}
                        Threshold: <span className="font-medium">{alert.threshold}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-6 w-6 border-b-2 border-primary mx-auto mb-2 rounded-full"></div>
              <p className="text-muted-foreground">Loading configuration...</p>
            </div>
          ) : alertConfigs.length === 0 ? (
            <div className="py-8 text-center border rounded-lg">
              <p className="text-muted-foreground">No alert configurations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alertConfigs.map(config => (
                <div key={config.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{config.component}: {config.metric}</h4>
                      <div className="grid grid-cols-2 gap-x-4 mt-1">
                        <p className="text-sm">
                          Warning: <span className="font-medium">{config.warning_threshold}</span>
                        </p>
                        <p className="text-sm">
                          Critical: <span className="font-medium">{config.critical_threshold}</span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Notification: {config.notification_channel}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAlertConfig(config.id, config.enabled)}
                    >
                      {config.enabled ? (
                        <Bell className="h-4 w-4 text-green-500" />
                      ) : (
                        <BellOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
