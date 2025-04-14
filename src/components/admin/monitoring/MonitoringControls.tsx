
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringConfig } from "@/hooks/use-monitoring-config";
import { ConfigurationItem } from "./controls/ConfigurationItem";
import { LoadingState } from "./controls/LoadingState";
import { ErrorMessage } from "./controls/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MonitoringConfiguration } from "@/utils/monitoring/types";

interface MonitoringControlsProps {
  onConfigUpdate?: () => void;
  redisConnected?: boolean;
}

export function MonitoringControls({ onConfigUpdate, redisConnected }: MonitoringControlsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const {
    config,
    isLoading,
    error,
    updateConfig,
    reloadConfig
  } = useMonitoringConfig('default');

  const updateConfigField = (field: string, value: any) => {
    // Handle nested properties
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateConfig({
        [parent]: {
          ...config[parent as keyof MonitoringConfiguration],
          [child]: value
        }
      });
    } else {
      updateConfig({ [field]: value });
    }
  };

  const saveConfigurations = async () => {
    setIsSaving(true);
    try {
      await updateConfig(config);
      if (onConfigUpdate) {
        onConfigUpdate();
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monitoring Configuration</CardTitle>
          {redisConnected !== undefined && (
            <Badge className={redisConnected ? "bg-green-500" : "bg-red-500"}>
              <Database className="h-3 w-3 mr-1" />
              Redis {redisConnected ? "Connected" : "Disconnected"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && <ErrorMessage message={error.message} />}
          
          <ConfigurationItem 
            label="Monitoring Status"
            description="Enable or disable system monitoring"
            type="toggle"
            value={config.enabled}
            configKey="enabled"
            onChange={updateConfigField}
          />
          
          <ConfigurationItem 
            label="Log Level"
            description="Configure monitoring detail level"
            type="select"
            options={[
              { label: 'Debug', value: 'debug' },
              { label: 'Info', value: 'info' },
              { label: 'Warning', value: 'warn' },
              { label: 'Error', value: 'error' }
            ]}
            value={config.logLevel}
            configKey="logLevel"
            onChange={updateConfigField}
          />
          
          <ConfigurationItem 
            label="Sampling Rate"
            description="Percentage of operations to monitor (0.1-1.0)"
            type="number"
            value={config.samplingRate}
            configKey="samplingRate"
            onChange={updateConfigField}
            min={0.1}
            max={1.0}
          />
          
          <ConfigurationItem 
            label="Retention Period (days)"
            description="Days to keep monitoring data"
            type="number"
            value={config.retentionPeriod}
            configKey="retentionPeriod"
            onChange={updateConfigField}
            min={1}
            max={90}
          />
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-4">Component Monitoring</h3>
            
            {Object.entries(config.components).map(([key, value]) => (
              <ConfigurationItem 
                key={key}
                label={`${key.charAt(0).toUpperCase() + key.slice(1)} Monitoring`}
                type="toggle"
                value={value}
                configKey={`components.${key}`}
                onChange={updateConfigField}
              />
            ))}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              variant="default" 
              disabled={isSaving}
              onClick={saveConfigurations}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
